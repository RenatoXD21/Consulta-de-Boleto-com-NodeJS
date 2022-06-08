const request = require('supertest')
const route = require('./src/route')

describe('Teste da linha digitável', () => {
    it('Linha digitável válida', async () => {
        const codigo = '03399817896900000090612172401015784480000002000'
        
        const response = await request(route).get(`/boleto/${codigo}`)

        expect(response.status).toBe(200)
    })
    
    it('Linha digitável curta', async () => {
        const codigo = '123456'
        
        const response = await request(route).get(`/boleto/${codigo}`)

        expect(response.status).toBe(400)
        expect(response.text).toBe('Linha digitável deve conter entre 47 e 48 caracteres.')
    })

    it('Linha digitável contem caracter não numeral', async () => {
        const codigo = '2129000119211000121090447561740597587000000200r'
        
        const response = await request(route).get(`/boleto/${codigo}`)

        expect(response.status).toBe(400)
        expect(response.text).toBe('Linha digitável deve conter apenas números.')
    })
})

describe('Teste de boleto bancario', () => {
    it('Boleto bancario valido', async () => {
        const codigo = '21290001192110001210904475617405975870000002000'

        const response = await request(route).get(`/boleto/${codigo}`)

        expect(response.status).toBe(200)
        expect(response.body.barCode).toBe('21299758700000020000001121100012100447561740')
        expect(response.body.amount).toBe('20.00')
        expect(response.body.expirationDate).toBe('2018-07-16')
    })

    it('Boleto bancario invalido', async () => {
        const digitoVerificadorCampo1Invalido = '21290001191110001210904475617405975870000002000'
        const digitoVerificadorCampo2Invalido = '21290001192110001210104475617405975870000002000'
        const digitoVerificadorCampo3Invalido = '21290001192110001210904475617402975870000002000'
        const digitoVerificadorGeralInvalido = '21290001192110001210904475617405175870000002000'

        const response1 = await request(route).get(`/boleto/${digitoVerificadorCampo1Invalido}`)
        const response2 = await request(route).get(`/boleto/${digitoVerificadorCampo2Invalido}`)
        const response3 = await request(route).get(`/boleto/${digitoVerificadorCampo3Invalido}`)
        const response4 = await request(route).get(`/boleto/${digitoVerificadorGeralInvalido}`)

        expect(response1.status).toBe(400)
        expect(response1.text).toBe('Boleto inválido')

        expect(response2.status).toBe(400)
        expect(response2.text).toBe('Boleto inválido')

        expect(response3.status).toBe(400)
        expect(response3.text).toBe('Boleto inválido')

        expect(response4.status).toBe(400)
        expect(response4.text).toBe('Boleto inválido')
    })
})

describe('Teste de boleto concessionario', () => {
    it('Boleto concessionario valido', async () => {
        const codigo = '826900000009247605340006002022000562258401005040'

        const response = await request(route).get(`/boleto/${codigo}`)

        expect(response.status).toBe(200)
        expect(response.body.barCode).toBe('82690000000247605340000020220005625840100504')
        expect(response.body.amount).toBe('24.76')
    })

    it('Boleto concessionario invalido', async () => {
        const digitoVerificadorCampo1Invalido = '826900000001247605340006002022000562258401005040'
        const digitoVerificadorCampo2Invalido = '826900000009247605340002002022000562258401005040'
        const digitoVerificadorCampo3Invalido = '826900000009247605340006002022000563258401005040'
        const digitoVerificadorCampo4Invalido = '826900000009247605340006002022000562258401005044'
        const digitoVerificadorCampoGeralInvalido = '826000000009247605340006002022000562258401005040'

        const response1 = await request(route).get(`/boleto/${digitoVerificadorCampo1Invalido}`)
        const response2 = await request(route).get(`/boleto/${digitoVerificadorCampo2Invalido}`)
        const response3 = await request(route).get(`/boleto/${digitoVerificadorCampo3Invalido}`)
        const response4 = await request(route).get(`/boleto/${digitoVerificadorCampo4Invalido}`)
        const response5 = await request(route).get(`/boleto/${digitoVerificadorCampoGeralInvalido}`)

        expect(response1.status).toBe(400)
        expect(response1.text).toBe('Boleto inválido')

        expect(response2.status).toBe(400)
        expect(response2.text).toBe('Boleto inválido')

        expect(response3.status).toBe(400)
        expect(response3.text).toBe('Boleto inválido')

        expect(response4.status).toBe(400)
        expect(response4.text).toBe('Boleto inválido')

        expect(response5.status).toBe(400)
        expect(response5.text).toBe('Boleto inválido')
    })
})