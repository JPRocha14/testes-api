describe('Criação de review com usuário deslogado', function () {
    it('Não deve permitir criar review', function () {
        cy.request({
            method: 'POST',
            url: '/api/users/review',
            body: {
                movieId: 1,
                score: 3,
                reviewText: "muito ruim!"
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(401);
            cy.fixture('./fixture-review/semAutorizacao.json').then(function (unauthorized) {
                expect(response.body).to.deep.eq(unauthorized);
                expect(unauthorized).to.be.an('object');
            });
        });
    });
})