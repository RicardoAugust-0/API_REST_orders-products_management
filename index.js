const express = require('express');
const bodyParser = require('body-parser');
const app =  express();
app.use(bodyParser.json());

const ordersRouter = require('./src/pages/pedidos');
const productsRouter = require('./src/pages/produtos');

app.use('/orders', ordersRouter);
app.use('/products', productsRouter);

const PORT = 3500;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});