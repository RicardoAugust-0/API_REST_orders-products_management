const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

//Criando ARRAY para armazenar os valores dos produtos
let products = [];

// Requisição para adicionar produtos
app.post("/products", (req, res) => {
  const { nome, descricao, preco, quantidade, peso, disponibilidade } =
    req.body;
  const newProduct = {
    id: products.length + 1,
    nome,
    descricao,
    preco,
    quantidade,
    peso,
    disponibilidade,
  };
  const produtoExistente = products.find((product) => product.nome === nome);
  if (produtoExistente) {
    res.status(400).json({ message: "Produto já cadastrado." });
  } else {
    products.push(newProduct);
    res
      .status(201)
      .json({ message: "Produto cadastrado no sistema!", product: newProduct });
  }
});

//Requisitando algum produto especifíco pelo ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find(
    (product) => product.id === parseInt(productId)
  );

  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    res.status(200).json({ message: "Produto encontrado:", product: product });
  }
});

// Requisitar todos os produtos
app.get("/products", (req, res) => {
  const productsList = products;
  res
    .status(200)
    .json({ message: "Lista de produtos:", products: productsList });
});

// Atualizar algum produto
app.put("/products/:id", (req, res) => {
  const { nome, descricao, preco, quantidade, peso, disponibilidade } =
    req.body;
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);
  
  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    product.nome = nome;
    product.descricao = descricao;
    product.preco = preco;
    product.quantidade = quantidade;
    product.peso = peso;
    product.disponibilidade = disponibilidade;
    res.status(200).json({ message: "Produto atualizado!", product: product });
  }
});

// Excluir algum produto
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);
  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    const index = products.indexOf(product);
    products.splice(index, 1);
    res.status(200).json({ message: "Produto excluído!" });
  }
});

let port = 7777;
app.listen(port, () => {
  console.log(`Meu server está ligado em  http://localhost:${port}`);
});