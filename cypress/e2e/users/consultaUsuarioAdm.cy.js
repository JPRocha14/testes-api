import { faker } from '@faker-js/faker';

describe('Consulta de Usuário', () => {
    var id;
    var token;
    var randomEmail = faker.internet.email();

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

    after(function () {
        cy.log('Deletando usuário')
        cy.request({
            method: 'DELETE',
            url: '/api/users/' + id,
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    })

    it('Deve listar todos os usuários', () => {
        cy.request({
            method: 'GET',
            url: '/api/users',
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
        })
    })

    it('Deve listar o usuário pelo id', () => {
        cy.request({
            method: 'GET',
            url: '/api/users/' + id,
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('object')
            expect(response.body).to.deep.include({name: 'João Pedro'})
        })
    })
})