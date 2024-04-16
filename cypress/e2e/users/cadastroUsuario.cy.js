import { faker } from '@faker-js/faker';

describe('Cadastro de Usuário', () => {
  var id;
  var token;
  var randomEmail = faker.internet.email();
  
  before(function(){
    cy.log('Cadastrando usuário')
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: randomEmail,
        password: 'senhacorreta'
      }
    }).then(function(response){
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
    }).then(function(response){
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

  after(function(){
    cy.log('Deletando usuário')
    cy.request({
      method: 'DELETE',
      url: '/api/users/' + id,
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  })

  it('Deve cadastrar usuário com um email válido', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'joao'+randomEmail,
        password: 'senhacorreta'
      },
    }).then(function(response){
      expect(response.status).to.eq(201)
    })
  })

  it('Não deve cadastrar usuário com um email já existente', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: randomEmail,
        password: 'senhacorreta'
      },
      failOnStatusCode: false
    }).then(function(response){
      expect(response.status).to.eq(409)
      expect(response.body).to.deep.eq({
        message: "Email already in use",
        error: "Conflict",
        statusCode: 409
      })
    })
  })

  it('Não deve cadastrar usuário com campo email em branco', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: '',
        password: 'senhacorreta'
      },
      failOnStatusCode: false
    }).then(function(response){
      expect(response.status).to.eq(400)
      expect(response.body).to.deep.eq({
        message: [
          "email must be longer than or equal to 1 characters",
          "email must be an email",
          "email should not be empty"
        ],
        error: "Bad Request",
        statusCode: 400
      })
    })
  })

  it('Não deve cadastrar usuário com campo email incompleto', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'pedrojoaogmail.com',
        password: 'senhacorreta'
      },
      failOnStatusCode: false
    }).then(function(response){
      expect(response.status).to.eq(400)
      expect(response.body).to.deep.eq({
        message: [
          "email must be an email"
        ],
        error: "Bad Request",
        statusCode: 400
      })
    })
  })
  
  it('Não deve cadastrar usuário com campo senha de 5 dígitos', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'pedrojoao6@gmail.com',
        password: 'senha'
      },
      failOnStatusCode: false
    }).then(function(response){
      expect(response.status).to.eq(400)
      expect(response.body).to.deep.eq({
        message: [
          "password must be longer than or equal to 6 characters"
        ],
        error: "Bad Request",
        statusCode: 400
      })
    })
  })

  it('Deve permitir cadastrar usuário com campo senha de 6 dígitos', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'pedro'+randomEmail,
        password: '123456'
      },
    }).then(function(response){
      expect(response.status).to.eq(201)
    })
  })

  it('Deve permitir cadastrar usuário com campo senha de 12 dígitos', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'jp'+randomEmail,
        password: 'senhacorreta'
      },
    }).then(function(response){
      expect(response.status).to.eq(201)
    })
  })

  it('Não deve cadastrar usuário com campo senha de 13 dígitos', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'pedrojoao800@gmail.com',
        password: 'senhacorreta!'
      },
      failOnStatusCode: false
    }).then(function(response){
      expect(response.status).to.eq(400)
      expect(response.body).to.deep.eq({
        message: [
          "password must be shorter than or equal to 12 characters"
        ],
        error: "Bad Request",
        statusCode  : 400
      })
    })
  })

  it('Não deve cadastrar usuário com campo senha em branco', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { 
        name: 'João Pedro',
        email: 'pedrojoao91238@gmail.com',
        password: ''
      },
      failOnStatusCode: false
    }).then(function(response){
      expect(response.status).to.eq(400)
      expect(response.body).to.deep.eq({
        message: [
          "password must be longer than or equal to 6 characters",
          "password should not be empty"
        ],
        error: "Bad Request",
        statusCode: 400
      })
    })
  })
})