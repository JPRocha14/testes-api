import { faker } from '@faker-js/faker';

describe('Criação de Filme', function () {
    var id;
    var token;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário e 
    // logar com o usuário cadastrado 
    before(function () {
        cy.log('Cadastrando usuário');
        cy.request({
            method: 'POST',
            url: '/api/users',
            body: {
                name: 'João Pedro',
                email: randomEmail,
                password: 'senhacorreta'
            }
        }).then(function (response) {
            expect(response.status).to.eq(201);
            id = response.body.id;
        });
        cy.log('Logando usuário');
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: randomEmail,
                password: 'senhacorreta'
            }
        }).then(function (response) {
            expect(response.status).to.eq(200);
            token = response.body.accessToken;
        });
    });

    // hook para inativar usuário
    after(function () {
        cy.log('Inativando usuário')
        cy.request({
            method: 'PATCH',
            url: '/api/users/inactivate',
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            expect(response.status).to.eq(204);
        });
    });

    it('Não deve permitir cadastrar filme', function () {
        cy.fixture('./fixture-criarFilme/criarFilme.json').then(function (filmeCriado) {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: filmeCriado,
                failOnStatusCode: false
            })
        }).then(function (response) {
            expect(response.status).to.eq(403);
            cy.fixture('./fixture-criarFilme/criarFilmeNaoAdmin.json').then(function (cadastroInvalido) {
                expect(response.body).to.deep.eq(cadastroInvalido);
            });
            expect(response.body).to.be.an('object');
        });
    });
})