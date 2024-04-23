import { faker } from '@faker-js/faker';

describe('Criação de Filme', function () {
    var id;
    var movieId;
    var token;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário, logar com o usuário cadastrado 
    // e torná-lo admin para poder excluí-lo depois
    before(function () {
        cy.log('Cadastrando usuário');
        cy.cadastroRandom(randomEmail).then(function (idUser) {
            id = idUser;
            cy.log('Logando usuário');
            cy.loginUser(randomEmail).then(function (response) {
                token = response.body.accessToken;
                cy.log('Tornando usuário admin')
                cy.tornarAdm(token).then(function () {
                });
            });
        });
    });

    // hook para excluir usuário criado
    after(function () {
        cy.log('Deletando filme');
        cy.deletarFilme(movieId, token);
        cy.log('Deletando usuário');
        cy.deleteUsuario(id, token);
    })

    describe('Cenário válido de criação de filme', function () {
        it('Deve permitir criar um novo filme', function () {
            cy.fixture('./fixture-criarFilme/criarFilme.json').then(function (filmeCriado) {
                cy.request({
                    method: 'POST',
                    url: '/api/movies',
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    body: filmeCriado,
                }).then(function (response) {
                    movieId = response.body.id;
                    expect(response.status).to.eq(201);
                    expect(response.body.description).to.eq('Um traíra trai o irmão e faz o sobrinho ter rancor');
                    expect(response.body.durationInMinutes).to.eq(88);
                    expect(response.body.genre).to.eq('Aventura e ação');
                    expect(response.body.releaseYear).to.eq(1994);
                    expect(response.body.title).to.eq('Rei Leão');
                    expect(response.body.id).to.eq(movieId);
                });
            });
        });
    });

    describe('Cenários inválidos de criação de filme', function () {
        it('Não deve permitir criar um novo filme com title vazio', function () {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "",
                    genre: "Aventura e ação",
                    description: "Um traíra trai o irmão e faz o sobrinho ter rancor",
                    durationInMinutes: 88,
                    releaseYear: 1994
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-criarFilme/tituloVazio.json').then(function (emptyTitle) {
                    expect(response.body).to.deep.eq(emptyTitle);
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir criar um novo filme com genre vazio', function () {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "Rei Leão",
                    genre: "",
                    description: "Um traíra trai o irmão e faz o sobrinho ter rancor",
                    durationInMinutes: 88,
                    releaseYear: 1994
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-criarFilme/generoVazio.json').then(function (emptyGenre) {
                    expect(response.body).to.deep.eq(emptyGenre);
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir criar um novo filme com description vazia', function () {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "Rei Leão",
                    genre: "Aventura e ação",
                    description: "",
                    durationInMinutes: 88,
                    releaseYear: 1994
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-criarFilme/descricaoVazia.json').then(function (emptyDescription) {
                    expect(response.body).to.deep.eq(emptyDescription);
                });
                expect(response.body).to.be.an('object');
            });
        });

        it('Não deve permitir criar um novo filme com as strings vazias', function () {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    title: "",
                    genre: "",
                    description: "",
                    durationInMinutes: 88,
                    releaseYear: 1994
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
                cy.fixture('./fixture-criarFilme/stringsVazias.json').then(function (emptyStrings) {
                    expect(response.body).to.deep.eq(emptyStrings);
                });
                expect(response.body).to.be.an('object');
            });
        });
    });
})


