# Comandos para importação e exportação de dados:

### Exportação de uma coleção:

mongoexport --collection=NOME_COLECAO --db=NOME_BD --out=FICHEIRO.json --jsonArray --pretty

### Importação de uma coleção:

mongoimport --db NOME_BD --collection NOME_COLECAO --file FICHEIRO.json --jsonArray --drop