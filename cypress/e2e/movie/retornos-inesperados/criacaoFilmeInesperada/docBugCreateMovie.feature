Funcionalidade: Cadastro de filmes

Contexto: Cadastro de filmes
Dado a URL 'https://raromdb-3c39614e42d4.herokuapp.com'

Cenário: Resultado inesperado ao cadastrar um filme com duração em minutos negativa
Quando ele preenche as informações do filme corretamente no path '/api/movies'
E preenche a duração em minutos do filme com um valor negativo
Então o retorno deveria ser "400: Bad Request"
Mas o sistema retorna o Response Code "201"

Cenário: Resultado inesperado ao cadastrar um filme com ano de lançamento negativo
Quando ele preenche as informações do filme corretamente no path '/api/movies'
E preenche o ano de lançamento do filme com um valor negativo
Então o retorno deveria ser "400: Bad Request"
Mas o sistema retorna o Response Code "200"