const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

//Criando ARRAY para armazenar os valores dos produtos
let products = [];

// Requisição para adicionar produtos
app.post("/products", (req, res) => {
  const { nome, descricao, preco, quantidade, peso, disponibilidade } = req.body;
  const newProduct = {
    id: products.length + 1,
    nome,
    descricao,
    preco,
    quantidade,
    peso,
    disponibilidade
  };
  const produtoExistente = products.find(product => product.nome === nome);
  if (produtoExistente) {
    res.status(400).json({ message: "Produto não cadastrado."});
  } else {
    products.push(newProduct);
    res.status(201).json({ message: "Produto cadastrado no sistema!", product: newProduct});
  }
});

//Requisitando algum produto especifíco pelo ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find((product) => product.id === productId);

  if (!product) {
    res.status(404).json({ message: "Produto não encontrado"});
  } else {
    res.status(200).json({ message: "Produto encontrado:", product: product});
  }
});

app.get("/products", (req, res) => {
    const productsList = products;
    res.status(200).json({ message: "Lista de produtos:", products: productsList});
});


let port = 7777;
app.listen(port, () => {
  console.log(`Meu server está ligado em  http://localhost:${port}`);
});
