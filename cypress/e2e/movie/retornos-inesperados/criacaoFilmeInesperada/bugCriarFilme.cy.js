import { faker } from '@faker-js/faker';

describe('Retorno inesperado ao criar filmes erroneamente', function () {
    var id;
    var token;
    var randomEmail = faker.internet.email();

    // hook para cadastrar usuário, logar com o usuário cadastrado 
    // e torná-lo admin para poder excluí-lo depois
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
            cy.log('Tornando usuário admin')
            cy.request({
                method: 'PATCH',
                url: '/api/users/admin',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
        })
    })

    // hook para excluir usuário criado
    after(function () {
        cy.log('Deletando usuário');
        cy.deleteUsuario(id, token);
    })

    it('Não deve permitir criar um novo filme com durationInMinutes negativa', function () {
        cy.request({
            method: 'POST',
            url: '/api/movies',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: {
                title: "Rei Leão",
                genre: "Aventura e ação",
                description: "Um traíra trai o irmão e faz o sobrinho ter rancor",
                durationInMinutes: -88,
                releaseYear: 1994
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(400);
        })
    })

    it('Não deve permitir criar um novo filme com releaseYear negativa', function () {
        cy.request({
            method: 'POST',
            url: '/api/movies',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: {
                title: "Rei Leão",
                genre: "Aventura e ação",
                description: "Um traíra trai o irmão e faz o sobrinho ter rancor",
                durationInMinutes: 88,
                releaseYear: -1994
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(400);
        })
    })
})