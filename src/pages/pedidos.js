// Importação de dependências
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();

// Configurando o servidor para usar o Body-Parser
app.use(bodyParser.json());

// Armazenamento de pedidos
let orders = [];

// Endpoint para criar pedidos
router.post("/orders", (req, res) => {
  // Criando rota para chamar produtos
  const { getProducts } = require("./produtos");
  const products = getProducts();

  // Obter produtos selecionados pelo usuário
  const selectedProducts = req.body.products;

  // Verificar se os produtos selecionados existem
  const validProducts = selectedProducts.filter((productId) =>
    products.find((product) => product.id === productId)
  );

  if (validProducts.length != selectedProducts.length) {
    return res.status(400).json({
      message: "Produtos inválidos!",
    });
  }

  // Calcular o valor total do pedido
  const totalPrice = validProducts.reduce((acc, productId) => {
    const product = products.find((product) => product.id === productId);
    return acc + product.price * req.body.quantity;
  }, 0);

  // Criamos um novo pedido
  const { quantity, adress, description } = req.body;
  const newOrder = {
    id: orders.length + 1,
    ...req.body,
    products: validProducts,
    totalPrice,
  };

  // Verificamos se o pedido já existe
  if (
    orders.some(
      (order) =>
        order.product === newOrder.product &&
        order.quantity === newOrder.quantity &&
        order.adress === newOrder.adress &&
        order.description === newOrder.description
    )
  ) {
    return res.status(400).json({ message: "Pedido já existe." });
  } else {
    // Se não existe, adicionamos o novo pedido à lista
    orders.push(newOrder);
  }

  // Retornamos a resposta com a mensagem e o pedido criado
  res.status(201).json({
    message: "Pedido criado com sucesso.",
    order: newOrder,
  });
});

// Usar o router no app
app.use("/api", router);

const PORT = 3001;
app.listen(PORT);

module.exports = router;
