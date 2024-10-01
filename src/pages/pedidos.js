const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const axios = require("axios");

// Configurando o servidor para usar o Body-Parser
app.use(bodyParser.json());

// Armazenamento de pedidos
const orders = [];

// Função para validar o corpo da requisição
function validateRequestBody(req) {
  if (!req.body) {
    return { error: "Corpo da requisição vazio" };
  }

  if (!req.body.products || !Array.isArray(req.body.products)) {
    return { error: "Precisa ter algum produto, e necessita ser um array" };
  }

  if (!req.body.quantities || !Array.isArray(req.body.quantities)) {
    return { error: "Precisa ter um campo 'quantities' que seja um array" };
  }

  if (req.body.quantities.length !== req.body.products.length) {
    return {
      error:
        "Precisa ter um campo 'quantities' que seja um array com o mesmo comprimento que o 'products'",
    };
  }

  if (!req.body.adress) {
    return { error: "Precisa ter um campo 'adress'" };
  }

  if (!req.body.description) {
    return { error: "Precisa ter um campo 'description'" };
  }

  return { valid: true };
}

// Função para calcular o valor total do pedido
function calculateTotalPrice(products, quantities) {
  let totalPrice = 0;

  products.forEach((product, index) => {
    const price = parseFloat(product.price.replace("R$", "").replace(",", "."));
    if (isNaN(price)) {
      throw new Error("Preço inválido");
    }
    totalPrice += price * quantities[index];
  });

  return totalPrice;
}

// Endpoint para criar pedidos
router.post("/orders", async (req, res) => {
  try {
    // Validar o corpo da requisição
    const validation = validateRequestBody(req);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    // Fazer uma requisição para a API de produtos
    const response = await axios.get("http://localhost:3000/api/products");

    // Obter a lista de produtos
    const products = response.data.products;

    // Obter produtos selecionados pelo usuário
    const selectedProducts = req.body.products;

    // Verificar se os produtos selecionados existem
    const validProducts = selectedProducts.filter((productId) =>
      products.find((product) => product.id === productId)
    );

    if (validProducts.length !== selectedProducts.length) {
      return res.status(400).json({ message: "Produtos inválidos" });
    }

    // Calcular o valor total do pedido
    const totalPrice = calculateTotalPrice(
      products.filter((product) => validProducts.includes(product.id)),
      req.body.quantities
    );

    // Criamos um novo pedido
    const newOrder = {
      id: orders.length + 1,
      products: validProducts.map((productId) => ({
        id: productId,
        quantity: req.body.quantities[validProducts.indexOf(productId)],
      })),
      adress: req.body.adress,
      description: req.body.description,
      totalPrice,
      status: "Pendente",
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
      return res.status(400).json({ message: "Pedido já existe" });
    } else {
      // Se não existe, adicionamos o novo pedido à lista
      orders.push(newOrder);
    }

    // Retornamos a resposta com a mensagem e o pedido criado
    res.status(201).json({
      message: "Pedido criado com sucesso",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
});

// Endpoint para buscar pedidos pelo Id
router.get("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = orders.find((order) => order.id === parseInt(orderId));

    // Validação para saber se o Id é válido ou não
    if (isNaN(orderId) || order <= 0) {
      res.status(400).json({ message: "Id não é válido!" });
      return;
    }

    // Validação para ver  se o pedido existe
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.status(200).json({
      message: "Pedido encontrado",
      order: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar pedido" });
  }
});

// Endpoint para listar todos os pedidos criados
router.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Parâmetros de consulta inválidos" });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedOrders = orders.slice(startIndex, endIndex);

    if (paginatedOrders === 0) {
      res.status(404).json({ message: "Lista de pedidos está vazia" });
    }

    res.status(200).json({
      message: "Lista de pedidos",
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: orders.length,
        totalPages: Math.ceil(orders.length / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao listar pedidos" });
  }
});

// Endpoint para atualizar informações ou o status do pedido
router.put("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, ...newOrder } = req.body;

    // Defina os status válidos
    const validStatus = ["Pendente", "Enviado", "Entregue"];

    // Verifique se o status fornecido é válido
    if (!validStatus.includes(status)) {
      res.status(400).json({
        message:
          "Status inválido. Os status válidos são: Pendente, Enviado, Entregue",
      });
      return;
    }

    // Encontre o pedido
    const order = orders.find((order) => order.id === parseInt(orderId));

    // Verifique se o pedido existe
    if (!order) {
      res.status(404).json({ message: "Pedido não encontrado" });
      return;
    }

    // Atualize o pedido
    order.status = status;
    let updatedOrder = { ...order, ...newOrder };

    res.status(200).json({
      message: "Pedido atualizado com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar pedido" });
  }
});

// Endpoint para deletar um pedido
router.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    if (isNaN(orderId) || orderId <= 0) {
      res.status(400).json({ message: "Id do pedido inválido" });
      return;
    }
    const orderIndex = orders.findIndex(
      (order) => order.id === parseInt(orderId)
    );
    if (orderIndex === -1) {
      res.status(404).json({ message: "Pedido não encontrado" });
      return;
    }
    orders.splice(orderIndex, 1);
    res.status(200).json({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao deletar pedido" });
  }
});

// Inicia o servidor
const PORT = 3001;
app.listen(PORT);

// Usar o router no app
app.use("/api", router);
module.exports = router;