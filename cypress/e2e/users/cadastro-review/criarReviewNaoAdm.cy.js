import { faker } from '@faker-js/faker';

describe('Criação de review por usuário não admin', function () {
    var id;
    var token;
    var randomEmail = faker.internet.email();


    // hook para cadastrar usuário e logar com o usuário cadastrado 
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

    // hook para inativar usuário depois de todos os testes
    after(function () {
        cy.log('Inativando usuário');
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

    describe('Review Correta', function () {
        it('Deve permitir criar review com score = 1', function () {
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 1,
                    score: 1,
                    reviewText: "muito ruim!"
                }
            }).then(function (response) {
                expect(response.status).to.eq(201);
                expect(response.body).to.be.undefined;
            });
        });

        it('Deve permitir criar review com score = 5', function () {
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 1,
                    score: 5,
                    reviewText: "muito ruim!"
                }
            }).then(function (response) {
                expect(response.status).to.eq(201);
                expect(response.body).to.be.undefined;
            });
        });
    });

    describe('Review incorreta', function () {
        it('Não deve permitir criar review de um filme inexistente', function () {
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 0,
                    score: 3,
                    reviewText: "muito bom!"
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(404);
                cy.fixture('./fixture-review/filmeInexistente.json').then(function (notFoundMovie) {
                    expect(response.body).to.deep.eq(notFoundMovie);
                    expect(notFoundMovie).to.be.an('object');
                });
            });
        });

        it('Não deve permitir criar review com um score menor que 1', function () {
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 1,
                    score: 0,
                    reviewText: "muito bom!"
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-review/scoreInvalido.json').then(function (wrongScore) {
                    expect(response.body).to.deep.eq(wrongScore);
                    expect(wrongScore).to.be.an('object');
                });
            });
        });

        it('Não deve permitir criar review com um score maior que 5', function () {
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 1,
                    score: 6,
                    reviewText: "muito bom!"
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-review/scoreInvalido.json').then(function (wrongScore) {
                    expect(response.body).to.deep.eq(wrongScore);
                    expect(wrongScore).to.be.an('object');
                });
            });
        });
    });
})