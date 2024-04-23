import { faker } from '@faker-js/faker';

describe('Listagem de Reviews', function () {
    var id;
    var token;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário,
    // logar usuário e criar uma review
    before(function () {
        cy.log('Cadastrando usuário')
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
        })
        cy.log('Logando usuário')
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: randomEmail,
                password: 'senhacorreta'
            }
        }).then(function (response) {
            expect(response.status).to.eq(200)
            token = response.body.accessToken
            cy.log('Criando review nº 1')
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 1,
                    score: 1,
                    reviewText: "muito bom!"
                }
            }).then(function (response) {
                expect(response.status).to.eq(201);
            })
            cy.log('Criando review nº 2')
            cy.request({
                method: 'POST',
                url: '/api/users/review',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: {
                    movieId: 2,
                    score: 3,
                    reviewText: "muito ruim!"
                }
            }).then(function (response) {
                expect(response.status).to.eq(201);
            })
        })
    })

    // hook para inativar usuário depois de todos os testes
    after(function () {
        cy.log('Inativando usuário')
        cy.request({
            method: 'PATCH',
            url: '/api/users/inactivate',
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            expect(response.status).to.eq(204)
        })
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