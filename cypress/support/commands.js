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