import { faker } from '@faker-js/faker';

describe('Listagem de Reviews', function () {
    var id;
    var token;
    var firstMovieId;
    var secondMovieId;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário,
    // logar usuário e criar uma review
    before(function () {
        cy.log('Cadastrando usuário');
        cy.cadastroRandom(randomEmail).then(function (idUser) {
            id = idUser;
            cy.log('Logando usuário');
            cy.loginUser(randomEmail).then(function (response) {
                token = response.body.accessToken;
                cy.log('Listando todos os filmes');
                cy.request({
                    method: 'GET',
                    url: '/api/movies',
                }).then(function (response) {
                    firstMovieId = response.body[0].id;
                    secondMovieId = response.body[1].id;
                    cy.log('Criando review sobre filme X')
                    cy.request({
                        method: 'POST',
                        url: '/api/users/review',
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                        body: {
                            movieId: firstMovieId,
                            score: 1,
                            reviewText: "muito bom!"
                        }
                    })
                    cy.log('Criando review sobre filme Y')
                    cy.request({
                        method: 'POST',
                        url: '/api/users/review',
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                        body: {
                            movieId: secondMovieId,
                            score: 3,
                            reviewText: "muito ruim!"
                        }
                    });
                });
            });
        });
    });

    // hook para inativar usuário depois de todos os testes
    after(function () {
        cy.log('Inativando usuário')
        cy.inativarUser(token);
    })

    it('Deve permitir listar reviews feita pelo usuário', function () {
        cy.request({
            method: 'GET',
            url: '/api/users/review/all',
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            expect(response.status).to.eq(200);
            response.body.forEach(function (review) {
                expect(review).to.have.property('id');
                expect(review).to.have.property('movieId');
                expect(review).to.have.property('movieTitle');
                expect(review).to.have.property('reviewText');
                expect(review).to.have.property('reviewType');
                expect(review).to.have.property('score');
            })
        })
    })
})