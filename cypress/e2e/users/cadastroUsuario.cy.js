import { faker } from '@faker-js/faker';

describe('Cadastro de Usuário', () => {
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
    cy.log('Deletando usuário')
    cy.deleteUsuario(id, token)
  })

  // cenários de cadastros válidos
  describe('Cadastros válidos', function () {
    it('Deve permitir cadastrar usuário com um email válido', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'joao' + randomEmail,
          password: 'senhacorreta'
        },
      }).then(function (response) {
        expect(response.status).to.eq(201)
      })
    })

    it('Deve permitir permitir cadastrar usuário com campo senha de 6 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'pedro' + randomEmail,
          password: '123456'
        },
      }).then(function (response) {
        expect(response.status).to.eq(201)
      })
    })

    it('Deve permitir permitir cadastrar usuário com campo senha de 12 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'jp' + randomEmail,
          password: 'senhacorreta'
        },
      }).then(function (response) {
        expect(response.status).to.eq(201)
      })
    })
  })

  // cenários de cadastros inválidos
  describe('Cadastros inválidos', function () {
    it('Não deve permitir cadastrar usuário com um email já existente', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: randomEmail,
          password: 'senhacorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(409)
        cy.fixture('./fixture-cadastro/emailDuplicado.json').then(function (emailExistente) {
          expect(response.body).to.deep.eq(emailExistente)
        })
      })
    })

    it('Não deve permitir cadastrar usuário com campo email em branco', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: '',
          password: 'senhacorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/emailVazio.json').then(function (emailVazio) {
          expect(response.body).to.deep.eq(emailVazio)
        })
      })
    })

    it('Não deve permitir cadastrar usuário com campo email incompleto', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'pedrojoaogmail.com',
          password: 'senhacorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/emailIncompleto.json').then(function (emailIncompleto) {
          expect(response.body).to.deep.eq(emailIncompleto)
        })
      })
    })

    it('Não deve permitir cadastrar usuário com campo senha de 5 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'pedrojoao6@gmail.com',
          password: 'senha'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/senhaCurta.json').then(function (senhaCurta) {
          expect(response.body).to.deep.eq(senhaCurta)
        })
      })
    })

    it('Não deve permitir cadastrar usuário com campo senha de 13 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'pedrojoao800@gmail.com',
          password: 'senhacorreta!'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/senhaLonga.json').then(function (senhaLonga) {
          expect(response.body).to.deep.eq(senhaLonga)
        })
      })
    })

    it('Não deve permitir cadastrar usuário com campo senha em branco', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'pedrojoao91238@gmail.com',
          password: ''
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/senhaVazia.json').then(function (senhaVazia) {
          expect(response.body).to.deep.eq(senhaVazia)
        })
      })
    })
  })

})