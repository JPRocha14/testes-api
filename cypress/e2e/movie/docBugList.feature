Funcionalidade: Consulta de filmes

Contexto: Consulta de filmes específicos
Dado a URL 'https://raromdb-3c39614e42d4.herokuapp.com'

Cenário: Resultado inesperado ao consultar filme por nome inexistente
Quando ele pesquisa pelo filme inexistente 'filmequenaoexisteallalalalalalalal' no path '/api/movies/search'
Então o retorno deveria ser '404: Not Found'
Mas o sistema retorna o Response Code "200"

Cenário: Resultado inesperado ao consultar filme por id inexistente
Quando ele pesquisa o filme por um id inexistente '129082131221' no path '/api/movies/{id}'
Então o retorno deveria ser '404: Not Found'
Mas o sistema retorna o Response Code "200"