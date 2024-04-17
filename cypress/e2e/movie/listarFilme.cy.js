describe('Consulta de filme', function () {
    var firstMovieId;
    var firstMovieName;

    // cenários que comprovam que não precisa estar logado para
    // listar os filmes cadastrados
    it('Listar todos os filmes cadastrados', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies',
        }).then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            firstMovieId = response.body[0].id
            firstMovieName = response.body[0].title
            cy.log(firstMovieId)
            cy.log(firstMovieName)
        })
    })

    it('Consulta de filme pelo nome', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/search?title=' + firstMovieName,
        }).then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
        })
    })

    it('Consulta de filme pelo id', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/' + firstMovieId,
        }).then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('object')
        })
    })
})