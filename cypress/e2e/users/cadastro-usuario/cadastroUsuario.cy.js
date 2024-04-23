import { faker } from '@faker-js/faker';

describe('Cadastro de Usuário', () => {
  var idUsuario;
  var token;
  var email = faker.internet.email();
  var password = 'senhacorreta';

  // cenários de cadastros válidos
  describe('Cadastros válidos', function () {
    // hook para logar usuário  e
    // inativá-lo depois de cada teste
    afterEach(function () {
      cy.log('Logando usuário');
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: email,
          password: password
        }
      }).then(function (response) {
        token = response.body.accessToken;
        cy.log('Inativando usuário');
        cy.request({
          method: 'PATCH',
          url: '/api/users/inactivate',
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
      });
    });

    it('Deve permitir cadastrar usuário com um email válido', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: password
        },
      }).then(function (response) {
        idUsuario = response.body.id;
        expect(response.status).to.eq(201);
        expect(response.body.id).to.eq(idUsuario);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('type');
        expect(response.body).to.be.an('object');
      });
    });

    it('Deve permitir permitir cadastrar usuário com campo senha de 6 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: password
        },
      }).then(function (response) {
        idUsuario = response.body.id;
        expect(response.status).to.eq(201);
        expect(response.body.id).to.eq(idUsuario);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('type');
        expect(response.body).to.be.an('object');
      });
    });

    it('Deve permitir permitir cadastrar usuário com campo senha de 12 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: password
        },
      }).then(function (response) {
        idUsuario = response.body.id;
        expect(response.status).to.eq(201);
        expect(response.body.id).to.eq(idUsuario);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('type');
        expect(response.body).to.be.an('object');
      });
    });
  });

  // cenários de cadastros inválidos
  describe('Cadastros inválidos', function () {
    // hook para criar um usuário a fim de utilizá-lo no primeiro
    // cenário de teste
    before(function () {
      cy.log('Cadastrando usuário para realizar o teste de email duplo');
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: password
        }
      }).then(function (response) {
        expect(response.status).to.eq(201);
      });
    });

    // hook para logar o usuário criado no BEFORE
    // e inativá-lo logo em seguida depois de todos
    // os testes
    after(function () {
      cy.log('Logando usuário')
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: email,
          password: password
        }
      }).then(function (response) {
        token = response.body.accessToken;
        cy.log('Inativando usuário')
        cy.request({
          method: 'PATCH',
          url: '/api/users/inactivate',
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
      });
    });

    it('Não deve permitir cadastrar usuário com um email já existente', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: password
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(409);
        cy.fixture('./fixture-cadastro/emailDuplicado.json').then(function (emailExistente) {
          expect(response.body).to.deep.eq(emailExistente);
          expect(emailExistente).to.be.an('object');
        });
      });
    });

    it('Não deve permitir cadastrar usuário com campo email em branco', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: '',
          password: password
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/emailVazio.json').then(function (emailVazio) {
          expect(response.body).to.deep.eq(emailVazio);
          expect(emailVazio).to.be.an('object');
        });
      });
    });

    it('Não deve permitir cadastrar usuário com campo email incompleto', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: 'joaopedrogmail.com',
          password: password
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/emailIncompleto.json').then(function (emailIncompleto) {
          expect(response.body).to.deep.eq(emailIncompleto);
          expect(emailIncompleto).to.be.an('object');
        });
      });
    });

    it('Não deve permitir cadastrar usuário com campo senha de 5 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: 'senha'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/senhaCurta.json').then(function (senhaCurta) {
          expect(response.body).to.deep.eq(senhaCurta);
          expect(senhaCurta).to.be.an('object');
        });
      });
    });

    it('Não deve permitir cadastrar usuário com campo senha de 13 dígitos', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: password + '!'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/senhaLonga.json').then(function (senhaLonga) {
          expect(response.body).to.deep.eq(senhaLonga);
          expect(senhaLonga).to.be.an('object');
        });
      });
    });

    it('Não deve permitir cadastrar usuário com campo senha em branco', () => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'João Pedro',
          email: email,
          password: ''
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/senhaVazia.json').then(function (senhaVazia) {
          expect(response.body).to.deep.eq(senhaVazia);
          expect(senhaVazia).to.be.an('object');
        });
      });
    });

    it('Não deve permitir cadastrar usuário com campo nome em branco', function () {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: {
          name: '',
          email: email,
          password: '123456'
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.eq(400)
        cy.fixture('./fixture-cadastro/nomeVazio.json').then(function (nomeVazio) {
          expect(response.body).to.deep.eq(nomeVazio);
          expect(nomeVazio).to.be.an('object');
        });
      });
    })
  });
})