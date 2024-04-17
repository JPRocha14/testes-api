import { faker } from '@faker-js/faker';

describe('Consulta de Usuário Não Admin', () => {
    var id;
    var token;
    var randomEmail = faker.internet.email();
    var randomNumber = faker.number.bigInt({ min: 1000000n });

    // hook para cadastrar usuário e logar com o usuário cadastrado
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

    // cenários de listagens não válidas por um usuário comum
    describe('Listagem inválida pelo usuário comum', function () {
        it('Não deve permitir listar todos os usuários', function () {
            cy.request({
                method: 'GET',
                url: '/api/users',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(403)
                cy.fixture('./fixture-consulta/listagemInvalida.json').then(function (listagemInvalida) {
                    expect(response.body).to.deep.eq(listagemInvalida)
                })
                expect(response.body).to.be.an('object')
            })
        })

        it('Não deve permitir conseguir listar outros usuários pelo id', function () {
            cy.request({
                method: 'GET',
                url: '/api/users/' + randomNumber,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(403)
                cy.fixture('./fixture-consulta/listagemInvalida.json').then(function (listagemInvalida) {
                    expect(response.body).to.deep.eq(listagemInvalida)
                })
                expect(response.body).to.be.an('object')
            })
        })
    })

    // cenário de listagem válida por um usuário comum
    describe('Listagem válida pelo usuário comum', function () {
        it('Deve permitir conseguir listar seu próprio usuário pelo id', function () {
            cy.request({
                method: 'GET',
                url: '/api/users/' + id,
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(function (response) {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.include({ name: 'João Pedro' })
                expect(response.body).to.be.an('object')
            })
        })
    })

})