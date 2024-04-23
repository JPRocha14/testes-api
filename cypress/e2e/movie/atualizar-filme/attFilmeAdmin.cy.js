import { faker } from '@faker-js/faker';

describe('Atualização de Filme', function () {
    var id;
    var token;
    var firstMovieId;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário, logar com o usuário cadastrado 
    // e torná-lo admin para poder excluí-lo depois
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
            expect(response.status).to.eq(201)
            id = response.body.id
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
            cy.log('Tornando usuário admin');
            cy.request({
                method: 'PATCH',
                url: '/api/users/admin',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            cy.log('Listando todos os filmes para pegar o ID do primeiro');
            cy.request({
                method: 'GET',
                url: '/api/movies',
            }).then(function (response) {
                expect(response.status).to.eq(200);
                firstMovieId = response.body[0].id;
            });
        });
    });

    // hook para excluir usuário criado
    after(function () {
        cy.log('Deletando usuário');
        cy.deleteUsuario(id, token);
    })

    describe('Cenário válido de atualização de filme', function () {
        it('Deve permitir atualizar um filme', function () {
            cy.fixture('./fixture-attFilme/filmeAtt.json').then(function (newMovie) {
                cy.request({
                    method: 'PUT',
                    url: '/api/movies/' + firstMovieId,
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    body: newMovie
                }).then(function (response) {
                    expect(response.status).to.eq(204);
                });
            });
        });
    });

    describe('Cenários inválidos de atualização de filme', function () {
        it('Não deve permitir atualizar um filme com title vazio', function () {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + firstMovieId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "",
                    genre: "sadas",
                    description: "sadasdas",
                    durationInMinutes: 60,
                    releaseYear: 2023
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-attFilme/tituloVazio.json').then(function (emptyTitle) {
                    expect(response.body).to.deep.eq(emptyTitle)
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir atualizar um filme com genre vazio', function () {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + firstMovieId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "Tentando atualizar filme",
                    genre: "",
                    description: "sadasdas",
                    durationInMinutes: 60,
                    releaseYear: 2023
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-attFilme/generoVazio.json').then(function (emptyGenre) {
                    expect(response.body).to.deep.eq(emptyGenre)
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir atualizar um filme com description vazio', function () {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + firstMovieId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "Tentando atualizar filme",
                    genre: "sadasd",
                    description: "",
                    durationInMinutes: 60,
                    releaseYear: 2023
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-attFilme/descricaoVazia.json').then(function (emptyDescription) {
                    expect(response.body).to.deep.eq(emptyDescription)
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir atualizar um filme com as strings vazias', function () {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + firstMovieId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "",
                    genre: "",
                    description: "",
                    durationInMinutes: 0,
                    releaseYear: 0
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400)
                cy.fixture('./fixture-attFilme/stringsVazias.json').then(function (emptyStrings) {
                    expect(response.body).to.deep.eq(emptyStrings)
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir atualizar um filme que não exista', function () {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + 0,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "Novo filme",
                    genre: "ação",
                    description: "sadasdasd",
                    durationInMinutes: 54,
                    releaseYear: 2000
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(404);
                cy.fixture('./fixture-attFilme/filmeNotFound.json').then(function (notFoundMovie) {
                    expect(response.body).to.deep.eq(notFoundMovie)
                });
                expect(response.body).to.be.an('object');
            });
        });
    });
})