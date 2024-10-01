const express = require("express");
const bodyParser = require("body-parser");
const validations = require("../components/validations");

const app = express();
const router = express.Router();

app.use(bodyParser.json());

const products = [];

// Função para validar dados de produto
const isValidProduct = (product) => {
  return (
    validations.dataValidationName(product) &&
    validations.dataValidationPrice(product) &&
    validations.dataValidationQuantity(product) &&
    validations.dataValidationWeight(product) &&
    validations.dataValidationDisponibility(product)
  );
};

// Função para formatar produto para exibição
const formatProduct = (product) => {
  return {
    ...product,
    weight: `${product.weight}KG`,
    price: `R$${product.price}`,
  };
};

// Rota para adicionar produto
router.post("/products", (req, res) => {
  const {
    name,
    description,
    price,
    quantity,
    weight,
    disponibility,
    expirationDate,
  } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    quantity,
    weight,
    disponibility,
    expirationDate,
  };

  if (!isValidProduct(newProduct)) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const productExists = products.find((product) => {
    return (
      product.name === newProduct.name &&
      product.description === newProduct.description &&
      product.price === newProduct.price &&
      product.quantity === newProduct.quantity &&
      product.weight === newProduct.weight &&
      product.disponibility === newProduct.disponibility
    );
  });

  if (productExists) {
    return res.status(400).json({ message: "Produto já cadastrado" });
  }

  products.push(newProduct);

  const formattedProduct = formatProduct(newProduct);

  res.status(201).json({
    message: "Produto cadastrado com sucesso!",
    product: formattedProduct,
  });
});

// Rota para buscar produto por ID
router.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId) || productId <= 0) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  const formattedProduct = formatProduct(product);

  res.status(200).json({
    message: "Produto encontrado",
    product: formattedProduct,
  });
});

// Rota para buscar todos os produtos
router.get("/products", (req, res) => {
  const { page = 1, limit = 100 } = req.query;

  if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
    return res
      .status(400)
      .json({ message: "Parâmetros de consulta inválidos" });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = products.slice(startIndex, endIndex);

  if (paginatedProducts.length === 0) {
    return res.status(404).json({ message: "Lista de produtos vazia" });
  }

  const formattedProducts = paginatedProducts.map((product) =>
    formatProduct(product)
  );

  res.status(200).json({
    message: "Lista de produtos",
    products: formattedProducts,
    pagination: {
      page,
      limit,
      total: products.length,
      totalPages: Math.ceil(products.length / limit),
    },
  });
});

// Rota para atualizar produto
router.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId) || productId <= 0) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  const { name, description, price, quantity, weight, disponibility } =
    req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.quantity = quantity;
  product.weight = weight;
  product.disponibility = disponibility;

  if (!isValidProduct(product)) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const formattedProduct = formatProduct(product);

  res.status(200).json({
    message: "Produto atualizado com sucesso!",
    product: formattedProduct,
  });
});

// Rota para excluir produto
router.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId) || productId <= 0) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  products.splice(productIndex, 1);

  res.status(200).json({ message: "Produto excluído com sucesso!" });
});

const PORT = 3000;
app.listen(PORT);

module.exports = products;

// Usar o router no app
module.exports = router;
app.use("/api", router);