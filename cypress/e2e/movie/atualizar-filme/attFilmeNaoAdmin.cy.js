import { faker } from '@faker-js/faker';

describe('Atualização de filme', function () {
    var id;
    var token;
    var firstMovieId;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário,
    // logar com o usuário cadastrado
    // e listar todos os filmes
    before(function () {
        cy.log('Cadastrando usuário');
        cy.cadastroRandom(randomEmail).then(function (idUser) {
            id = idUser;
            cy.log('Logando usuário');
            cy.loginUser(randomEmail).then(function (response) {
                token = response.body.accessToken;
            });
            cy.log('Listando todos os filmes para pegar o ID do primeiro');
            cy.listarFilmes();
        });
    });

    // hook para inativar usuário criado
    after(function () {
        cy.log('Inativando usuário');
        cy.inativarUser(token);
    });

    it('Não deve permitir atualizar um filme cadastrado', function () {
        cy.fixture('./fixture-attFilme/filmeAtt.json').then(function (newMovie) {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + firstMovieId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: newMovie,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(403);
                cy.fixture('./fixture-consulta/listagemInvalida.json').then(function (forbidden) {
                    expect(response.body).to.deep.eq(forbidden);
                    expect(forbidden).to.be.an('object');
                });
            });
        });
    });
})