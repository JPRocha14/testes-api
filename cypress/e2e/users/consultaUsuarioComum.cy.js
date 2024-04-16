import { faker } from '@faker-js/faker';

describe('Consulta de Usuário Não Admin', () => {
    var id;
    var token;
    var randomEmail = faker.internet.email();
    var randomNumber = faker.number.bigInt({ min: 1000000n });

    before(function () {
        cy.log('Cadastrando usuário')
        cy.request({
            method: 'POST',
            url: '/api/users',
            body: {
                name: 'João Pedro',
                email: randomEmail,
                password: 'senhacorreta'
            }
        }).then(function (response) {
            expect(response.status).to.eq(201)
            id = response.body.id
        })
        cy.log('Logando usuário')
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: randomEmail,
                password: 'senhacorreta'
            }
        }).then(function (response) {
            expect(response.status).to.eq(200)
            token = response.body.accessToken
        })
    })

    it('Não deve listar todos os usuários', function() {
        cy.request({
            method: 'GET',
            url: '/api/users',
            headers: {
                Authorization: 'Bearer ' + token
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(403)
            expect(response.body).to.deep.eq({
                message: "Forbidden",
                statusCode: 403
            })
            expect(response.body).to.be.an('object')
        })
    })

    it('Deve conseguir listar seu próprio usuário pelo id', function(){
        cy.request({
            method: 'GET',
            url: '/api/users/' + id,
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.deep.include({name: 'João Pedro'})
            expect(response.body).to.be.an('object')
        })
    })

    it('Não deve conseguir listar outros usuários pelo id', function(){
        cy.request({
            method: 'GET',
            url: '/api/users/' + randomNumber,
            headers: {
                Authorization: 'Bearer ' + token
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(403)
            expect(response.body).to.deep.eq({
                message: "Forbidden",
                statusCode: 403
            })
            expect(response.body).to.be.an('object')
        })
    })
})