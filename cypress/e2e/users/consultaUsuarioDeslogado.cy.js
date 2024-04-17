import { faker } from '@faker-js/faker';

describe('Consulta Usuário Deslogado', function () {

    // variável para randomizar o número do id
    var randomNumber = faker.number.bigInt({ min: 1n, max: 3000n });

    // cenários que mostram que um usuário não logado 
    // não tem permissão para listagem de usuários
    it('Não deve listar usuários estando deslogado', function () {
        cy.request({
            method: 'GET',
            url: '/api/users',
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(401)
            cy.fixture('./fixture-consulta/listagemDeslogado.json').then(function (listagemDeslogado) {
                expect(response.body).to.deep.eq(listagemDeslogado)
            })
            expect(response.body).to.be.an('object')
        })
    })

    it('Não deve listar usuários por id estando deslogado', function () {
        cy.log('ID aleatório: ' + randomNumber)
        cy.request({
            method: 'GET',
            url: '/api/users/' + randomNumber,
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(401)
            cy.fixture('./fixture-consulta/listagemDeslogado.json').then(function (listagemDeslogado) {
                expect(response.body).to.deep.eq(listagemDeslogado)
            })
            expect(response.body).to.be.an('object')
        })
    })
})