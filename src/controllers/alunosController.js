let alunoModel = require('../models/Aluno')
let planoModel = require('../models/Plano.js')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment')
const fs = require('fs');
const path = require('path')

exports.cadastrar = async (req, res) => {
    const { email, cpf, nome, plano, celular, pagamento } = req.body
    try {
        const aluno = new alunoModel({
            nome,
            email,
            cpf,
            plano,
            celular,
            pagamento,
        })

        await aluno.save()

        res.status(201).send(aluno);
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: err })
    }
};

exports.cadastrarPlano = async (req, res) => {
    const { email, cpf, plano, due } = req.body
    try {
        const aluno = new planoModel({
            email,
            cpf,
            plano,
            due,
        })

        await aluno.save()
        res.status(201).send(aluno);
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: err })
    }
};

exports.obterAlunos = async (req, res, next) => {
    try {
        const alunos = await alunoModel.find({})

        return res.status(201).send(alunos);
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: err })
    }
};

exports.obterAluno = async (req, res, next) => {
    try {
        const { cpf } = req.params
        let endDate;
        const aluno = await alunoModel.findOne({ cpf: cpf })
        const startDate = moment(aluno.createdAt)
        switch (aluno.plano) {
            case 'anual-2':
                endDate = moment(aluno.createdAt).add(12, 'months')
                break;
            case "anual-3":
                endDate = moment(aluno.createdAt).add(12, 'months')
                break;
            case 'mensal-2':
                endDate = moment(aluno.createdAt).add(1, 'months')
                break;
            case 'mensal-3':
                endDate = moment(aluno.createdAt).add(1, 'months')
                break;
            case 'trimestral-3':
                endDate = moment(aluno.createdAt).add(3, 'months')
                break;
            case 'trimestral-2':
                endDate = moment(aluno.createdAt).add(3, 'months')
                break;
            case 'semestral-2':
                endDate = moment(aluno.createdAt).add(6, 'months')
                break;
            case 'semestral-3':
                endDate = moment(aluno.createdAt).add(6, 'months')
                break;
            default:
                endDate = moment(aluno.createdAt).add(10, 'months')
                break;
        }

        let betweenMonths = []
        let date = startDate.startOf('month');
        while (date < endDate.endOf('month')) {
            betweenMonths.push(date.format('YYYY/MM'));
            date.add(1, 'month');
        }
        return res.status(201).send({ aluno: aluno, months: betweenMonths });
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: err })
    }
};

exports.obterRelatorio = async (req, res, next) => {
    try {
        const alunos = await alunoModel.find({});

        const dados = alunos.map(aluno => { 
            return { nome: aluno.nome, email: aluno.email , cpf: aluno.cpf, plano: aluno.plano, formaDePagamento: aluno.pagamento };
        });

        const filePath = path.join(__dirname, 'arquivo.csv');

        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                { id: 'nome', title: 'Nome' },
                { id: 'email', title: 'E-mail' },
                { id: 'cpf', title: 'CPF' },
                { id: 'plano', title: 'Plano' },
                { id: 'formaDePagamento', title: 'Forma de pagamento' }
            ]
        });

        await csvWriter.writeRecords(dados);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).send('Erro ao gerar relatório');
    }
};