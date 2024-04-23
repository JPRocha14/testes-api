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
            response.body.forEach(function (filmes) {
                expect(filmes).to.have.property('description');
                expect(filmes).to.have.property('durationInMinutes');
                expect(filmes).to.have.property('genre');
                expect(filmes).to.have.property('id');
                expect(filmes).to.have.property('releaseYear');
                expect(filmes).to.have.property('title');
                expect(filmes).to.have.property('totalRating');
            });
            firstMovieId = response.body[0].id;
            firstMovieName = response.body[0].title;
            cy.log(firstMovieId);
            cy.log(firstMovieName);
        });
    });

    it('Consulta de filme pelo nome', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/search?title=' + firstMovieName,
        }).then(function (response) {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(function (filmesEquivalentes) {
                expect(filmesEquivalentes).to.have.property('description');
                expect(filmesEquivalentes).to.have.property('durationInMinutes');
                expect(filmesEquivalentes).to.have.property('genre');
                expect(filmesEquivalentes).to.have.property('id');
                expect(filmesEquivalentes).to.have.property('releaseYear');
                expect(filmesEquivalentes).to.have.property('title');
                expect(filmesEquivalentes).to.have.property('totalRating');
            })
        });
    });

    it('Consulta de filme pelo id', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/' + firstMovieId,
        }).then(function (response) {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('audienceScore');
            expect(response.body).to.have.property('criticScore');
            expect(response.body).to.have.property('description');
            expect(response.body).to.have.property('durationInMinutes');
            expect(response.body).to.have.property('genre');
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('releaseYear');
            response.body.reviews.forEach(function (review) {
                expect(review).to.have.property('id');
                expect(review).to.have.property('reviewText');
                expect(review).to.have.property('reviewType');
                expect(review).to.have.property('score');
                expect(review).to.have.property('updatedAt');
                expect(review.user).to.have.property('id');
                expect(review.user).to.have.property('name');
                expect(review.user).to.have.property('type');

            })
        })
    })
})