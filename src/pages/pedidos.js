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
  const {getProducts} = require('./produtos');
  const products = getProducts();


  // Criamos um novo pedido
  const { quantity, adress, description } = req.body;
  const newOrder = {
    id: orders.length + 1,
    product,
    quantity,
    adress,
    description,
  };

  // Verificamos se o pedido já existe
  const existingOrder = orders.find((order) => {
    return (
      order.product === newOrder.product &&
      order.quantity === newOrder.quantity &&
      order.adress === newOrder.adress &&
      order.description === newOrder.description
    );
  });

  // Se o pedido já existe, retornamos um erro
  if (existingOrder) {
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
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Meu server de pedidos está ligado!`);
});

module.exports = router;