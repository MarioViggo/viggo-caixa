const sdk = require('api')('@pagarme/v4#1k7f61hltor0z8x');

sdk.auth('sk_test_97a2202e32904c8297c6a0b5cc3d9b14', '');
const aa = Buffer.from("sk_test_97a2202e32904c8297c6a0b5cc3d9b14").toString('base64')
console.log("==========", aa)
sdk.listarPedidos({page: '1', size: '10'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));

// sdk.criarPedido2({
//     customer: {
//       address: {
//         country: 'BR',
//         state: 'RN',
//         city: 'Caicó',
//         zip_code: '59300000',
//         line_1: 'Rua Manoel Lucio de Araujo, 296',
//         line_2: '296, casa de esquina'
//       },
//       phones: {home_phone: {area_code: '84', number: '998049717', country_code: '55'}},
//       type: 'pessoa física',
//       name: 'LUCIMARIO MAURO SOARES JUNIOR',
//       email: 'mariojuniorsoaresdev@gmail.com',
//       code: '1',
//       document: '70019443439',
//       document_type: 'CPF',
//       gender: 'male',
//       birthdate: '22/11/2000',
//       metadata: 'ok'
//     },
//     shipping: {
//       address: {
//         country: 'BR',
//         state: 'RN',
//         city: 'Caicó',
//         zip_code: '59300000',
//         line_1: 'Rua Manoel Lucio de Araujo, 296',
//         line_2: '296, casa de esquina'
//       },
//       amount: 2,
//       description: 'aaaa',
//       recipient_name: 'Lucimario',
//       recipient_phone: '5584998049717'
//     },
//     items: [{amount: 50, description: 'teste product', quantity: 1, code: '1'}],
//     payments: [
//       {
//         credit_card: {
//           card: {
//             billing_address: {
//               line_1: 'Rua Manoel Lucio de Araujo, 296',
//               line_2: '296, casa de esquina',
//               zip_code: '59300000',
//               city: 'Caicó',
//               state: 'RN',
//               country: 'BR'
//             },
//             number: '4000000000000010',
//             holder_name: 'LUCIMARIO SOARES',
//             holder_document: '70019443439',
//             exp_month: 11,
//             exp_year: 2025,
//             cvv: '123',
//             brand: 'Visa',
//             label: 'credito mock',
//             billing_address_id: '1'
//           },
//           operation_type: 'auth_and_capture',
//           installments: 1,
//           statement_descriptor: 'dasdas'
//         },
//         payment_method: 'credit_card'
//       }
//     ],
//     closed: true,
//     session_id: '322b821a',
//     antifraud_enabled: false
//   })
//   .then(({ data }) => console.log(data))
//   .catch(err => console.error(err));
// sdk.criarTransacao({
//   transaction_id: 1,
//   amount: 1000,
//   card_hash: 'string',
//   card_id: 'string',
//   card_holder_name: 'Lucimario Soares',
//   card_expiration_date: '2225',
//   card_number: '4000000000000010',
//   card_cvv: '123!',
//   payment_method: 'credit_card',
//   postback_url: 'string',
//   async: true,
//   installments: '1',
//   capture: 'true',
//   boleto_expiration_date: 'string',
//   soft_descriptor: 'string',
//   boleto_instructions: 'string',
//   customer: {
//     external_id: 'string',
//     name: 'string',
//     email: 'string',
//     country: 'string',
//     type: 'string',
//     phone_numbers: ['string']
//   },
//   metadata: 'string',
//   split_rules: [
//     {
//       recipient_id: 'string',
//       liable: true,
//       charge_processing_fee: true,
//       percentage: 0,
//       amount: 0,
//       charge_remainder: true
//     }
//   ],
//   boleto_fine: {days: 0, amount: 0, percentage: 'string'},
//   boleto_interest: {days: 0, amount: 0, percentage: 'string'},
//   boleto_rules: ['string'],
//   reference_key: 'string',
//   session: 'string',
//   local_time: 'Date'
// })
//   .then(({ data }) => console.log(data))
//   .catch(err => console.error(err));

