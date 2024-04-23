// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// command para cadastrar usuário
import { faker } from '@faker-js/faker';

Cypress.Commands.add('cadastroUsuario', function () {
    cy.log('Cadastro de usuário')
    return cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
            name: 'João Pedro',
            email: 'pedro123@gmail.com',
            password: 'senhacorreta'
        }
    }).then(function (response) {
        var id = response.body.id
        var email = response.body.email
        var name = response.body.name
        return { id: id, email: email, name: name, password: 'senhacorreta' }
    })
})

// command para deletar usuário
Cypress.Commands.add('deleteUsuario', function (id, token) {
    return cy.request({
        method: 'DELETE',
        url: '/api/users/' + id,
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
})

Cypress.Commands.add('cadastroRandom', function (email) {
    return cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
            name: 'João Pedro',
            email: email,
            password: '123456'
        }
    }).then(function (response) {
        const id = response.body.id;
        return id;
    })
})

Cypress.Commands.add('loginUser', function (email) {
    return cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
            email: email,
            password: '123456'
        }
    })
})

Cypress.Commands.add('tornarAdm', function (token) {
    return cy.request({
        method: 'PATCH',
        url: '/api/users/admin',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
})

Cypress.Commands.add('criarFilme', function (token) {

    return cy.fixture('./fixture-criarFilme/criarFilme.json').then(function (filmeCriado) {
        cy.request({
            method: 'POST',
            url: '/api/movies',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: filmeCriado,
        }).then(function (response) {
            var movieId = response.body.id;
            return movieId;
        });
    });
});

Cypress.Commands.add('inativarUser', function (token) {
    return cy.request({
        method: 'PATCH',
        url: '/api/users/inactivate',
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
})

Cypress.Commands.add('listarFilmes', function () {
    return cy.request({
        method: 'GET',
        url: '/api/movies',
    }).then(function (response) {
        var firstMovieId = response.body[0].id;
        return firstMovieId;
    });
})

Cypress.Commands.add('deletarFilme', function (movieId, token) {
    return cy.request({
        method: 'DELETE',
        url: '/api/movies/' + movieId,
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
})