// Importando o módulo Express para criar o servidor
const express = require("express");

// Importando o módulo Body-Parser para lidar com requisições JSON
const bodyParser = require("body-parser");

// Criando uma instância do servidor Express
const app = express();

// Configurando o servidor para usar o Body-Parser
app.use(bodyParser.json());

// Criando um array para armazenar os produtos
let products = [];

// Importando o módulo de validações para garantir a coerência dos dados
const validations = require("./components/validations");

// Definindo a rota para adicionar produtos
app.post("/products", (req, res) => {
  // Extrair os dados do corpo da requisição
  const {
    nome,
    descricao,
    preco,
    quantidade,
    peso,
    disponibilidade,
    validade,
  } = req.body;

  // Criar um novo produto com os dados recebidos
  const newProduct = {
    id: products.length + 1,
    nome,
    descricao,
    preco,
    quantidade,
    peso,
    disponibilidade,
    validade,
  };

  // Validar os dados do produto
  if (
    !validations.dataValidationName(newProduct) ||
    !validations.dataValidationPrice(newProduct) ||
    !validations.dataValidationQuantity(newProduct) ||
    !validations.dataValidationWeight(newProduct) ||
    !validations.dataValidationDisponibility(newProduct)
  ) {
    // Se os dados forem inválidos, retornar um erro 400
    return res.status(400).json({ message: "Dados inválidos" });
  }

  // Verificar se o produto já existe
  const productExists = products.find((product) => {
    return (
      product.nome === newProduct.nome &&
      product.descricao === newProduct.descricao &&
      product.preco === newProduct.preco &&
      product.quantidade === newProduct.quantidade &&
      product.peso === newProduct.peso &&
      product.disponibilidade === newProduct.disponibilidade
    );
  });

  // Se o produto já existe, retornar um erro 400
  if (productExists) {
    res.status(400).json({ message: "Produto já cadastrado." });
  } else {
    // Adicionar o produto ao array de produtos
    products.push(newProduct);

    // Formatatar o produto para exibição
    const formattedProduct = {
      ...newProduct,
      peso: `${newProduct.peso}KG`,
      preco: `$${newProduct.preco}`,
    };

    // Retornar o produto adicionado com um status 201
    res.status(201).json({
      message: "Produto cadastrado no sistema!",
      product: formattedProduct,
    });
  }
});

// Definindo a rota para buscar um produto específico pelo ID
app.get("/products/:id", (req, res) => {
  // Extrair o ID do produto da URL
  const productId = parseInt(req.params.id);

  // Buscar o produto no array de produtos
  const product = products.find((product) => product.id === productId);

  // Se o produto não for encontrado, retornar um erro 404
  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    // Retornar o produto encontrado com um status 200
    res.status(200).json({ message: "Produto encontrado", product: product });
  }
});

// Definindo a rota para buscar todos os produtos
app.get("/products", (req, res) => {
  // Extrair os parâmetros de paginação da URL
  const { page = 1, limit = 100 } = req.query;

  // Calcular o índice inicial e final para a paginação
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Extrair os produtos da página atual
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Verificar se a página está vazia
  if (paginatedProducts.length === 0) {
    // Se a página estiver vazia, retornar um erro 404
    res.status(404).json({ message: "Lista de produtos vazia" });
  } else if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
    // Se os parâmetros de consulta forem inválidos, retornar um erro 400
    res.status(400).json({ message: "Parâmetros de consulta inválidos" });
    return;
  } else {
    // Retornar a lista de produtos com informações de paginação
    res.status(200).json({
      message: "Lista de produtos:",
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit),
      },
    });
  }
});

// Definindo a rota para atualizar um produto
app.put("/products/:id", (req, res) => {
  // Extrair os dados do corpo da requisição
  const { nome, descricao, preco, quantidade, peso, disponibilidade } =
    req.body;

  // Extrair o ID do produto da URL
  const productId = parseInt(req.params.id);

  // Buscar o produto no array de produtos
  const product = products.find((product) => product.id === productId);

  // Se o produto não for encontrado, retornar um erro 404
  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    // Validar os dados do produto
    if (
      !validations.dataValidationName({ nome }) ||
      !validations.dataValidationPrice({ preco }) ||
      !validations.dataValidationQuantity({ quantidade }) ||
      !validations.dataValidationWeight({ peso }) ||
      !validations.dataValidationDisponibility({ disponibilidade })
    ) {
      // Se os dados forem inválidos, retornar um erro 400
      res.status(400).json({ message: "Dados inválidos" });
    } else {
      // Atualizar os dados do produto
      product.nome = nome;
      product.descricao = descricao;
      product.preco = preco;
      product.quantidade = quantidade;
      product.peso = peso;
      product.disponibilidade = disponibilidade;

      // Retornar o produto atualizado com um status 200
      res
        .status(200)
        .json({ message: "Produto atualizado!", product: product });
    }
  }
});

// Definindo a rota para excluir um produto
app.delete("/products/:id", (req, res) => {
  // Extrair o ID do produto da URL
  const productId = parseInt(req.params.id);

  // Buscar o índice do produto no array de produtos
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  // Se o produto não for encontrado, retornar um erro 404
  if (productIndex === -1) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    // Excluir o produto do array de produtos
    products.splice(productIndex, 1);

    // Retornar uma mensagem de sucesso com um status 200
    res.status(200).json({ message: "Produto excluído!" });
  }
});

// Definir a porta do servidor
let port = 7777;

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Meu server está ligado em  http://localhost:${port}`);
});
