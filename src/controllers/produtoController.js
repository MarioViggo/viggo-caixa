let produtoModel = require('../models/Produtos')


exports.cadastrarProduto = async (req, res) => {
    const { descricao, codigo_sequencial, status, estoque } = req.body
    const {imagens, codigo_de_barras} = req.files
    let imagem_list = []
    for (imagem of imagens) {
        imagem_list.push(imagem.buffer)
    }

    if (imagens?.length > 3) {
        return res.status(403).send("Só é permitido 3 fotos")
    }

    try {
        const produto = new produtoModel({
            descricao,
            codigo_sequencial,
            codigo_de_barras: codigo_de_barras[0].buffer,
            status, 
            estoque,
            imagens: imagem_list
        })
    
        await produto.save()
    
        res.status(201).send(produto);
    } catch (err) {
        console.log(err)
        return res.status(500).send({error: err})
    }
};