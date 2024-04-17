describe('Login de Usuário', () => {
  var name;
  var email;
  var password;
  var token;
  var id;

  // hook para cadastrar usuário, logar com o usuário cadastrado 
  // e torná-lo admin para poder excluí-lo depois
  before(function () {
    cy.cadastroUsuario().then(function (response) {
      id = response.id
      email = response.email
      name = response.name
      password = response.password
    }).then(function () {
      cy.log('Login de usuário')
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: email,
          password: password
        }
      }).then(function (response) {
        token = response.body.accessToken
        cy.log(token)
        cy.log('Permissão de admin')
        cy.request({
          method: 'PATCH',
          url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/admin',
          headers: {
            Authorization: "Bearer " + token
          }
        })
      })
    })
  })

  // hook para excluir usuário criado
  after(function () {
    cy.log('Excluindo usuário')
    cy.deleteUsuario(id, token)
  })

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
        expect(response.status).to.eq(400)
        expect(response.body).to.deep.eq({
          message: [
            "email should not be empty",
            "email must be an email"
          ],
          error: "Bad Request",
          statusCode: 400
        })
        expect(response.body).to.be.an('object')
      })
    })

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
        expect(response.status).to.eq(400)
        expect(response.body).to.deep.eq({
          message: [
            "email must be an email"
          ],
          error: "Bad Request",
          statusCode: 400
        })
        expect(response.body).to.be.an('object')
      })
    })

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
        expect(response.status).to.eq(401)
        expect(response.body).to.deep.eq({
          message: "Invalid username or password.",
          error: "Unauthorized",
          statusCode: 401
        })
        expect(response.body).to.be.an('object')
      })
    })

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
        expect(response.status).to.eq(400)
        expect(response.body).to.deep.eq({
          message: [
            "password should not be empty"
          ],
          error: "Bad Request",
          statusCode: 400
        })
        expect(response.body).to.be.an('object')
      })
    })

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
        expect(response.status).to.eq(401)
        expect(response.body).to.deep.eq({
          message: "Invalid username or password.",
          error: "Unauthorized",
          statusCode: 401
        })
        expect(response.body).to.be.an('object')
      })
    })
  })
})