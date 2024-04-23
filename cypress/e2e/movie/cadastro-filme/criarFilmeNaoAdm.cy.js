import { faker } from '@faker-js/faker';

describe('Criação de Filme', function () {
    var id;
    var token;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário e 
    // logar com o usuário cadastrado 
    before(function () {
        cy.log('Cadastrando usuário');
        cy.cadastroRandom(randomEmail).then(function (idUser) {
            id = idUser;
            cy.log('Logando usuário');
            cy.loginUser(randomEmail).then(function (response) {
                token = response.body.accessToken;
            });
        });
    });

    // hook para inativar usuário
    after(function () {
        cy.log('Inativando usuário')
        cy.inativarUser(token);
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