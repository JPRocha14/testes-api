import { faker } from '@faker-js/faker';

describe('Consulta Usuário Deslogado', function () {

    var randomNumber = faker.number.bigInt({ min: 1n, max: 3000n });

    it('Não deve listar usuários estando deslogado', function () {
        cy.request({
            method: 'GET',
            url: '/api/users',
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(401)
            expect(response.body).to.deep.eq({
                message: "Access denied.",
                error: "Unauthorized",
                statusCode: 401
            })
            expect(response.body).to.be.an('object')
        })
    })

    it('Não deve listar usuários por id estando deslogado', function () {
        cy.log('ID aleatório: ' + randomNumber)
        cy.request({
            method: 'GET',
            url: '/api/users/' + randomNumber,
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(401)
            expect(response.body).to.deep.eq({
                message: "Access denied.",
                error: "Unauthorized",
                statusCode: 401
            })
            expect(response.body).to.be.an('object')
        })
    })
})