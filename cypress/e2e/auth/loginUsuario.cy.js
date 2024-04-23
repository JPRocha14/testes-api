import { faker } from '@faker-js/faker';

describe('Login de Usuário', () => {
  var token;
  var id;
  var randomEmail = faker.internet.email();

  // hook para cadastrar usuário, logar com o usuário cadastrado 
  // e torná-lo admin para poder excluí-lo depois
  before(function () {
    cy.log('Cadastrando usuário');
    cy.cadastroRandom(randomEmail).then(function (idUser) {
      id = idUser;
      cy.log('Logando usuário');
      cy.loginUser(randomEmail).then(function (response) {
        token = response.body.accessToken;
        cy.log('Tornando usuário admin')
        cy.tornarAdm(token);
      });
    });
  });

  // hook para excluir usuário criado
  after(function () {
    cy.log('Excluindo usuário');
    cy.deleteUsuario(id, token);
  });

  // cenários de logins inválidos
  describe('Cenários de tentativa de login inválido', function () {
    it('Não deve permitir logar com email vazio', function () {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: '',
          password: 'senhacorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400);
        cy.fixture('./fixture-login/emailVazio.json').then(function (emptyEmail) {
          expect(response.body).to.deep.eq(emptyEmail)
        });
        expect(response.body).to.be.an('object');
      });
    });

    it('Não deve permitir logar com email incompleto', function () {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'pedrogmail.com',
          password: 'senhacorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400);
        cy.fixture('./fixture-login/emailIncompleto.json').then(function (incompleteEmail) {
          expect(response.body).to.deep.eq(incompleteEmail)
        });
        expect(response.body).to.be.an('object');
      });
    });

    it('Não deve permitir logar com email não cadastrado', function () {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'pedro12345@gmail.com',
          password: 'senhacorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(401);
        cy.fixture('./fixture-login/loginIncorreto.json').then(function (emailIncorreto) {
          expect(response.body).to.deep.eq(emailIncorreto)
        });
        expect(response.body).to.be.an('object');
      });
    });

    it('Não deve permitir logar com senha vazia', function () {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'pedro12@gmail.com',
          password: ''
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400);
        cy.fixture('./fixture-login/senhaVazia.json').then(function (senhaVazia) {
          expect(response.body).to.deep.eq(senhaVazia)
        });
        expect(response.body).to.be.an('object');
      });
    });

    it('Não deve permitir logar com senha incorreta', function () {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'pedro12@gmail.com',
          password: 'senhaincorreta'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(401);
        cy.fixture('./fixture-login/loginIncorreto.json').then(function (senhaIncorreta) {
          expect(response.body).to.deep.eq(senhaIncorreta)
        });
        expect(response.body).to.be.an('object');
      });
    });
  });
})