import { faker } from '@faker-js/faker';

describe('Criação de review por usuário admin', function () {
    var id;
    var token;
    var randomEmail = faker.internet.email();
    var movieId;


    // hook para cadastrar usuário, logar com o usuário cadastrado 
    // e torná-lo admin para poder excluí-lo depois
    before(function () {
        cy.log('Cadastrando usuário');
        cy.log(randomEmail);
        cy.cadastroRandom(randomEmail).then(function (idUser) {
            id = idUser;
            cy.log('Logando usuário');
            cy.loginUser(randomEmail).then(function (response) {
                token = response.body.accessToken;
                cy.log('Tornando usuário admin')
                cy.tornarAdm(token).then(function () {
                    cy.criarFilme(token).then(function (movieIdRecebido) {
                        movieId = movieIdRecebido;
                    });
                });
            });
        });
    });

    // hook para excluir usuário criado
    after(function () {
        cy.log('Deletando usuário');
        cy.deleteUsuario(id, token);
    });


    describe('Review correta', function () {
        it('Deve permitir criar review com score = 1', function () {
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: movieId,
                    score: 1,
                    reviewText: "muito bom!"
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
                    movieId: movieId,
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


