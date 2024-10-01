# API's REST - Gestão de produtos/pedidos
 Duas API's criadas em conjunto para suprir necessidades de gestão de dados com base na demanda de produtos e pedidos feitos por clientes.


# Índice
=================
<!--ts-->
   * [Sobre o Projeto](#sobre-o-projeto)
   * [Tecnologias Utilizadas](#tecnologias-utilizadas)
   * [Instalação e Execução](#instalação-e-execução)
   * [Endpoints](#endpoints)
   * [Contribuição](#contribuição)
   * [Autores](#autores)
<!--te-->

## Sobre o Projeto
Este projeto foi desenvolvido como atividade escolar na ETEC Bento Quirino, com o objetivo de criar duas API's em conjunto para suprir necessidades de gestão de produtos utilizando Node.js. Além disso também utilizada para superar meus próprios limites e desafios em desenvolvimento de API's.


## Tecnologias Utilizadas
- Node.js
- JavaScript
- Express
- Body-Parser
- Axios

## Instalação e Execução
Para executar o projeto, é necessário ter o Node.js instalado em sua máquina. Após clonar o repositório, execute os seguintes comandos:
```bash
npm install
npm start
```

## Endpoints
### Produtos
#### GET /api/products
Retorna uma lista de todos os produtos.
#### GET /api/products/:id
Retorna um produto específico pelo ID.
#### POST /api/products
Cria um novo produto.
#### PUT /api/products/:id
Atualiza um produto específico pelo ID.
#### DELETE /api/products/:id
Deleta um produto específico pelo ID.

### Pedidos
#### GET /api/orders
Retorna uma lista de todos os pedidos.
#### GET /api/orders/:id
Retorna um pedido específico pelo ID.
#### POST /api/orders
Cria um novo pedido.
#### PUT /api/orders/:id
Atualiza um pedido específico pelo ID.
#### DELETE /api/orders/:id
Deleta um pedido específico pelo ID.

## Contribuição
Contribuições são sempre bem-vindas! Se você tiver alguma sugestão ou encontrar algum erro, por favor, abra uma issue ou faça um pull request.

## Autores
- [Ricardo Augusto](https://github.com/RicardoAugust-0)