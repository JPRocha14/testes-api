describe('Retorno inesperado ao consultar filmes', function () {

    // cenários que mostram o retorno inesperado ao tentar
    // quebrar os testes
    it('Consulta por nome de um filme que não existe deve retornar Not Found', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/search?title=' + 'filmequenaoexisteallalalalalalalal',
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(404)
        })
    })

    it('Consulta por id de filme que não existe deve retornar Not Found', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/' + 129082131221,
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(404)
        })
    })
})