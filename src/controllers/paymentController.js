const lib = require('pagarme-core-api-nodejs')
const moment = require('moment')

exports.boleto = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_PROD;
    lib.Configuration.serviceRefererName = "serviceRefererName";
    console.log(req.body)
    let amount = 0;
    switch (req.body.plano) {
        case 'anual-2':
            amount += 60 * 100
            break;
        case "anual-3":
            amount += 70 * 100
            break;
        case 'mensal-2':
            amount += 80 * 100
            break;
        case 'mensal-3':
            amount += 95 * 100
            break;
        case 'trimestral-3':
            amount += 80 * 100
            break;
        case 'trimestral-2':
            amount += 70 * 100
            break;
        case 'semestral-2':
            amount += 65 * 100
            break;
        case 'semestral-3':
            amount += 75 * 100
            break;
        default: 
            amount += 60 * 100 
            break;
    }

    const ordersController = lib.OrdersController;
    
    let dueDate = moment(req.body.due);

    while (dueDate.isBefore(moment())) {
        dueDate.add(1, 'days')
    }
    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    // mock cpf
    customerRequest.document = '70019443439';

    const boletoRequest = new lib.CreateBoletoPaymentRequest();
    boletoRequest.bank = '033';
    boletoRequest.instructions = 'Pagar até o vencimento';
    boletoRequest.due_at = dueDate;

    const request = new lib.CreateOrderRequest();

    request.items = [new lib.CreateOrderItemRequest()];
    request.items[0].code = req.body.plano 
    request.items[0].description = `Gadelha Team - ${req.body.plano}`;
    request.items[0].quantity = 1;
    request.items[0].amount = amount;

    request.payments = [new lib.CreatePaymentRequest()];
    request.payments[0].payment_method = 'boleto';
    request.payments[0].boleto = boletoRequest;
    request.customer = customerRequest;

    ordersController
        .createOrder(request)
        .then(order => {
            console.log(order.charges[0].lastTransaction.gatewayResponse);
            console.log(order.charges[0].lastTransaction);
            console.log(`Order status: ${order.status}`);
            console.log(`Boleto pdf: ${order.charges[0].lastTransaction.pdf}`);
            return res.status(200).json({"url": order.charges[0].lastTransaction.url})
        })
        .catch((error, order) => {
            console.log(error, order)
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
              //  throw error;
            } else {
               // throw error;
            }
        });
}

exports.pix = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_PROD;
    lib.Configuration.serviceRefererName = "serviceRefererName";
    let amount = 0;
    switch (req.body.plano) {
        case 'anual-2':
            amount += 60 * 100
            break;
        case "anual-3":
            amount += 70 * 100
            break;
        case 'mensal-2':
            amount += 80 * 100
            break;
        case 'mensal-3':
            amount += 95 * 100
            break;
        case 'trimestral-3':
            amount += 80 * 100
            break;
        case 'trimestral-2':
            amount += 70 * 100
            break;
        case 'semestral-2':
            amount += 65 * 100
            break;
        case 'semestral-3':
            amount += 75 * 100
            break;
        default: 
            amount += 60 * 100 
            break;
    }

    let dueDate = moment(req.body.due);
    const ordersController = lib.OrdersController;
    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf.replace("-", "").replaceAll(".", "")

    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number.split(")")[1].replaceAll("-", "").replaceAll(" ", "");

    while (dueDate.isBefore(moment())) {
        dueDate.add(1, 'days')
    }
    const pixRequest = new lib.CreatePixPaymentRequest();
    pixRequest.bank = '033';
    pixRequest.expiresAt = dueDate

    const request = new lib.CreateOrderRequest();

    request.items = [new lib.CreateOrderItemRequest()];
    request.items[0].code = "codesample" 
    request.items[0].description = 'Tesseract Bracelet';
    request.items[0].quantity = 1;
    request.items[0].amount = amount;
    request.payments = [new lib.CreatePaymentRequest()];
    request.payments[0].payment_method = 'pix';
    request.payments[0].pix = pixRequest;
    request.customer = customerRequest;

    ordersController
        .createOrder(request)
        .then(order => {
            console.log(order.charges[0].lastTransaction.gatewayResponse);
             console.log(order.charges[0].lastTransaction.qrCode);
            return res.status(200).json({"qrcode": order.charges[0].lastTransaction.qrCode, "qrcodeurl": order.charges[0].lastTransaction.qrCodeUrl})
        })
        .catch(error => {
            console.log(error.errorResponse)
            return res.status(401).send(error.errorResponse)
        });
}

exports.mensal2 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'mensal2';
    request.currency = 'BRL';
   // request.planId = 'plan_lvxK0kwUAUJ0P6kZ'
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 1;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 1;
    request.statementDescriptor = 'Plano Mensal2';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR';

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 80
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 80
    request.pricingScheme.priceBrackets[0].price = 80
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== 'failed') {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Falha no pagamento!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}


exports.mensal3 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'mensal3';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 1;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 1;
    request.statementDescriptor = 'Plano Mensal3';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR';

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 95
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 95
    request.pricingScheme.priceBrackets[0].price = 95
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== 'failed') {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Falha no pagamento!")

        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

exports.trimestral2 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";
    console.log(req.body)
    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'trimestral2';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 3;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 3;
    request.statementDescriptor = 'Plano Trimestral2';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = "BR";

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 70
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 70
    request.pricingScheme.priceBrackets[0].price = 70
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            console.log(subscription)
            if (subscription.status !== "failed") {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Pagamento negado!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

exports.trimestral3 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'trimestral3';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 3;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 3;
    request.statementDescriptor = 'Plano Trimestral3';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR';
    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 80
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 80
    request.pricingScheme.priceBrackets[0].price = 80
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== "failed") {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Pagamento negado!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

exports.semestral2 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'semestral2';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 6;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 6;
    request.statementDescriptor = 'Plano Semestral2';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR';

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 65
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 65
    request.pricingScheme.priceBrackets[0].price = 65
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== "failed") {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Pagamento negado!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

exports.semestral3 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'semestral3';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 6;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 6;
    request.statementDescriptor = 'Plano Semestral3';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR'

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 75
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 75
    request.pricingScheme.priceBrackets[0].price = 75
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== "failed") {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Pagamento negado!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

exports.anual2 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'anual2';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 12;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 12;
    request.statementDescriptor = 'Plano Anual2';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR';

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 60
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 60
    request.pricingScheme.priceBrackets[0].price = 60
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== "failed") {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Pagamento negado!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

exports.anual3 = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.paymentMethod = req.body.paymentMethod;
    request.code = 'anual3';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 12;
    request.billingType = 'exact_day';
    request.billingDay = req.body.billingDay;
    request.installments = 12;
    request.statementDescriptor = 'Plano Anual3';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = req.body.name;
    customerRequest.email = req.body.email;
    customerRequest.type = 'individual';
    customerRequest.document = req.body.cpf;
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = req.body.ddd;
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = req.body.number;

    request.card = new lib.CreateCardRequest();
    request.card.holderName = req.body.holderName;
    request.card.number = req.body.cardNumber;
    request.card.expMonth = req.body.expMonth;
    request.card.expYear = req.body.expYear;
    request.card.cvv = req.body.cvv;
    request.card.billingAddress = new lib.CreateAddressRequest();
    request.card.billingAddress.line1 = req.body.address1;
    request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    request.card.billingAddress.zipCode = req.body.zipCode;
    request.card.billingAddress.city = req.body.city;
    request.card.billingAddress.state = req.body.state;
    request.card.billingAddress.country = 'BR';

    request.description = `${req.body.modalidade} - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 70
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 70
    request.pricingScheme.priceBrackets[0].price = 70
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest

    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            if (subscription.status !== "failed") {
                return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
            }

            return res.status(401).json("Pagamento negado!")
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
}

// exports.signature = async (req, res) => {
//     lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_TEST;
//     lib.Configuration.serviceRefererName = "serviceRefererName";

//     const subscriptionsController = lib.SubscriptionsController;

//     const request = new lib.CreateSubscriptionRequest();
//     request.paymentMethod = 'credit_card';
//     request.code = 'trimestral';
//     request.currency = 'BRL';
//     request.startAt = new Date("2024/04/02");
//     request.interval = 'month';
//     request.minimumPrice = 10000;
//     request.intervalCount = 3;
//     request.billingType = 'exact_day';
//     request.billingDay = 5;
//     request.installments = 3;
//     request.statementDescriptor = 'Plano Trimestral';

//     const customerRequest = new lib.CreateCustomerRequest();
//     customerRequest.name = 'MOCK STUDENT';
//     customerRequest.email = 'mariojuniorsoaresdev@gmail.com';
//     customerRequest.type = 'individual';
//     customerRequest.document = '70019443439';
//     customerRequest.documentType = 'CPF';
//     customerRequest.document_type = 'CPF';

//     customerRequest.phones = new lib.CreatePhonesRequest();
//     customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
//     customerRequest.phones.mobile_phone.area_code = '84';
//     customerRequest.phones.mobile_phone.country_code = '55';
//     customerRequest.phones.mobile_phone.number = '998049717';

//     request.card = new lib.CreateCardRequest();
//     request.card.holderName = 'Tony Stark';
//     request.card.number = '4000000000000010';
//     request.card.expMonth = 1;
//     request.card.expYear = 26;
//     request.card.cvv = '903';
//     request.card.billingAddress = new lib.CreateAddressRequest();
//     request.card.billingAddress.line1 = '375  Av. General Justo  Centro';
//     request.card.billingAddress.line2 = '8º andar';
//     request.card.billingAddress.zipCode = '20021130';
//     request.card.billingAddress.city = 'Rio de Janeiro';
//     request.card.billingAddress.state = 'RJ';
//     request.card.billingAddress.country = 'BR';


//     request.description = 'Muay Thai - Gadelha Team';
//     request.pricingScheme = new lib.CreatePricingSchemeRequest();
//     request.pricingScheme.schemeType = 'tier';
//     request.pricingScheme.minimumPrice = 1000
//     request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
//     request.pricingScheme.priceBrackets[0].endQuantity = 2000
//     request.pricingScheme.priceBrackets[0].price = 1000
//     request.pricingScheme.priceBrackets[0].overagePrice = 1000

//     request.customer = customerRequest
//     subscriptionsController
//         .createSubscription(request)
//         .then(subscription => {
//             console.log(`Subscription Id: ${subscription.id}`);
//             console.log(`Subscription Status: ${subscription.status}`);
//             console.log(`Subscription Interval: ${subscription.interval}`);
//             console.log(
//                 `Subscription Boleto DueDays: ${subscription.boletoDueDays}`
//             );
//             console.log(`Subscription Cycle: ${subscription.currentCycle.id}`);
//             console.log(
//                 `Subscription Cycle status: ${subscription.currentCycle.status}`
//             );
//             console.log(
//                 `Subscription Cycle StartAt: ${subscription.currentCycle.startAt}`
//             );
//             console.log(
//                 `Subscription Cycle EndAt: ${subscription.currentCycle.endAt}`
//             );
//             console.log(
//                 `Subscription Cycle BillingAt: ${subscription.currentCycle.billingAt
//                 }`
//             );
//         })
//         .catch(error => {
//             console.log(`Status Code: ${error.errorCode}`);
//             if (error.errorResponse instanceof lib.ErrorException) {
//                 console.log(error.errorResponse.message);
//                 console.log(error.errorResponse.errors);
//             } else {
//                 throw error;
//             }
//         });
// }

exports.signature = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_PROD;
    lib.Configuration.serviceRefererName = "serviceRefererName";

 
    const subscriptionsController = lib.SubscriptionsController;

    const request = new lib.CreateSubscriptionRequest();
    request.code = 'anual3';
    request.currency = 'BRL';
    request.interval = 'month';
    request.minimumPrice = 40000;
    request.intervalCount = 12;
    request.billingType = 'prepaid';
    request.installments = 12;
    request.statementDescriptor = 'Plano Anual3';

    const customerRequest = new lib.CreateCustomerRequest();
    customerRequest.name = 'mock boleto'
    customerRequest.email = 'mariojuniorsoaresdev@gmail.com';
    customerRequest.type = 'individual';
    customerRequest.document = '70019443439';
    customerRequest.documentType = 'CPF';
    customerRequest.phones = new lib.CreatePhonesRequest();
    customerRequest.phones.mobile_phone = new lib.CreatePhoneRequest();
    customerRequest.phones.mobile_phone.area_code = '84';
    customerRequest.phones.mobile_phone.country_code = '55';
    customerRequest.phones.mobile_phone.number = '998049717';
    
    request.paymentMethod = 'boleto';
    // request.card = new lib.CreateCardRequest();
    // request.card.holderName = req.body.holderName;
    // request.card.number = req.body.cardNumber;
    // request.card.expMonth = req.body.expMonth;
    // request.card.expYear = req.body.expYear;
    // request.card.cvv = req.body.cvv;
    // request.card.billingAddress = new lib.CreateAddressRequest();
    // request.card.billingAddress.line1 = req.body.address1;
    // request.card.billingAddress.line2 = req.body.address2 ? req.body.address2 : '';
    // request.card.billingAddress.zipCode = req.body.zipCode;
    // request.card.billingAddress.city = req.body.city;
    // request.card.billingAddress.state = req.body.state;
    // request.card.billingAddress.country = req.body.country;

    const boletoRequest = new lib.CreateBoletoPaymentRequest();
    boletoRequest.bank = '033';
    boletoRequest.instructions = 'Pagar até o vencimento';
   // boletoRequest.due_at = new Date("2024/04/04");

    request.description = `yhai - Gadelha Team`;
    request.pricingScheme = new lib.CreatePricingSchemeRequest();
    request.pricingScheme.schemeType = 'tier';
    request.pricingScheme.minimumPrice = 70
    request.pricingScheme.priceBrackets = [new lib.CreatePriceBracketRequest()]
    request.pricingScheme.priceBrackets[0].endQuantity = 70
    request.pricingScheme.priceBrackets[0].price = 70
    request.pricingScheme.priceBrackets[0].overagePrice = 1

    request.customer = customerRequest
    request.payments = [new lib.CreatePaymentRequest()];
    request.boletoDueDays = 5;
    request.payments[0].payment_method = 'boleto';
    request.payments[0].boleto = boletoRequest;
    subscriptionsController
        .createSubscription(request)
        .then(subscription => {
            return res.status(200).json({ message: 'Assinatura criada!', data: subscription })
        })
        .catch(error => {
            console.log(`Status Code: ${error.errorCode}`);
            console.log(`Status Code: ${error.errorResponse}`);
            if (error.errorResponse instanceof lib.ErrorException) {
                console.log(error.errorResponse.message);
                console.log(error.errorResponse.errors);
            } else {
                throw error;
            }
        });
    
}

exports.invoice = async (req, res) => {
    lib.Configuration.basicAuthUserName = process.env.PRIVATE_KEY_PROD;
    lib.Configuration.serviceRefererName = "serviceRefererName";

    const invoicesController = lib.InvoicesController;

    invoicesController.createInvoice("sub_8QbLZ0viDirlwYgV", "cycle_Vy4wPXjfofB2jJNd")
    .then(invoice => console.log(invoice))
    .catch(error => console.log(error))

}