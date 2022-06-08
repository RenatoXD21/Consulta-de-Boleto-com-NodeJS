const express = require('express')
const app = express();

const calculo = require('./calculos');

app.get('/boleto/:linhaDigitavel', (req, res) => {
    try {
        const linhaDigitavel = req.params.linhaDigitavel;

        if(linhaDigitavel.length != 47 && linhaDigitavel.length != 48  ) throw new Error('Linha digitável deve conter entre 47 e 48 caracteres.')

        if( isNaN(linhaDigitavel) ) throw new Error('Linha digitável deve conter apenas números.')

        let dados = {}

        let tipo;

        if(linhaDigitavel.length == 47)  tipo = 'bancario'
        else tipo = 'concessionaria'

        if(tipo == 'bancario') {
            const ifDestinataria = linhaDigitavel.substr(0,3);
            const codigoMoeda = linhaDigitavel.substr(3,1);
            const codigoBarrasParte1 = linhaDigitavel.substr(4,5);
            const digitoVerificadorCampo1 = linhaDigitavel.substr(9,1);
            const codigoBarrasParte2 = linhaDigitavel.substr(10,10);
            const digitoVerificadorCampo2 = linhaDigitavel.substr(20,1);
            const codigoBarrasParte3 = linhaDigitavel.substr(21,10);
            const digitoVerificadorCampo3 = linhaDigitavel.substr(31,1);
            const digitoVerificadorCodigo = linhaDigitavel.substr(32,1);
            const fatorVencimento = linhaDigitavel.substr(33,4);
            const valorBoleto = linhaDigitavel.substr(37,10);

            dados.barCode = (
                ifDestinataria +
                codigoMoeda +
                digitoVerificadorCodigo +
                fatorVencimento +
                valorBoleto +
                codigoBarrasParte1 +
                codigoBarrasParte2 +
                codigoBarrasParte3
            )

            const campo1 = ifDestinataria + codigoMoeda + codigoBarrasParte1;
            const digitoVerificadorCalculadoCampo1 = calculo.tituloBancario.DigitoVerificador(campo1, 2)

            const campo2 = codigoBarrasParte2;
            const digitoVerificadorCalculadoCampo2 = calculo.tituloBancario.DigitoVerificador(campo2, 1)

            const campo3 = codigoBarrasParte3;
            const digitoVerificadorCalculadoCampo3 = calculo.tituloBancario.DigitoVerificador(campo3, 1)

            const digitoVerificadorCodigoCalculado = calculo.tituloBancario.DigitoVerificadorGeral(dados.barCode)

            const verificacaoDigitosVerificadores = [ 
                digitoVerificadorCalculadoCampo1 == digitoVerificadorCampo1,
                digitoVerificadorCalculadoCampo2 == digitoVerificadorCampo2,
                digitoVerificadorCalculadoCampo3 == digitoVerificadorCampo3,
                digitoVerificadorCodigoCalculado == digitoVerificadorCodigo
            ]

            if( verificacaoDigitosVerificadores.includes(false) ) throw new Error('Boleto inválido')

            dados.amount = (parseFloat(valorBoleto) / 100).toFixed(2);

            if(parseInt(fatorVencimento) != 0) {
                dados.expirationDate = calculo.tituloBancario.Vencimento(fatorVencimento)
            }
        }

        if(tipo == 'concessionaria') {
            let codigo = linhaDigitavel;

            codigo = codigo.split('')

            const spliceToString = (array, posicao, tamanho) => array.splice(posicao,tamanho).reduce( (string, caracter) => string + caracter )

            const campo1 = spliceToString(codigo, 0, 11)
            const digitoVerificadorCampo1 = spliceToString(codigo, 0, 1)
            const campo2 = spliceToString(codigo, 0, 11)
            const digitoVerificadorCampo2 = spliceToString(codigo, 0, 1)
            const campo3 = spliceToString(codigo, 0, 11)
            const digitoVerificadorCampo3 = spliceToString(codigo, 0, 1)
            const campo4 = spliceToString(codigo, 0, 11)
            const digitoVerificadorCampo4 = spliceToString(codigo, 0, 1)

            const dvGeral = campo1.substr(3,1)
            const valor = (campo1 + campo2).substr(4,11)

            const digitoVerificadorCalculado1 = calculo.concessionaria.DigitoVerificador(campo1)
            const digitoVerificadorCalculado2 = calculo.concessionaria.DigitoVerificador(campo2)
            const digitoVerificadorCalculado3 = calculo.concessionaria.DigitoVerificador(campo3)
            const digitoVerificadorCalculado4 = calculo.concessionaria.DigitoVerificador(campo4)

            let campoGeral = (campo1 + campo2 + campo3 + campo4).split('')
            campoGeral.splice(3,1);
            campoGeral = campoGeral.reduce( (string, caracter) => string + caracter )

            const dvGeralCalculado = calculo.concessionaria.DigitoVerificador(campoGeral)

            const verificacaoDigitosVerificadores = [ 
                digitoVerificadorCalculado1 == digitoVerificadorCampo1,
                digitoVerificadorCalculado2 == digitoVerificadorCampo2,
                digitoVerificadorCalculado3 == digitoVerificadorCampo3,
                digitoVerificadorCalculado4 == digitoVerificadorCampo4,
                dvGeralCalculado == dvGeral
            ]

            if( verificacaoDigitosVerificadores.includes(false) ) throw new Error('Boleto inválido')

            dados.barCode = campo1 + campo2 + campo3 + campo4;
            dados.amount = (parseFloat(valor) / 100).toFixed(2);
        }

        res.send(dados)
    }
    catch(error) {
        res.status(400)
        res.send(error.message)
    }
})

module.exports = app;