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

  TODO; /* :Implemente a lógica para criar um pedido com base nos produtos selecionados pelo usuário. Criar um novo pedido deve incluir a lista de produtos selecionados e o valor total do pedido.*/

  TODO; /* Valor total do produto se baseia na lógica  de que o valor total é a soma dos valores dos produtos selecionados.
 Logo tenho que fazer pedidos * valor. */

  // Criamos um novo pedido
  const { quantity, adress, description } = req.body;
  const newOrder = { id: orders.length + 1, ...req.body, products };

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
