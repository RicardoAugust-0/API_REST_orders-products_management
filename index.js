const express = require('express');
const bodyParser = require('body-parser');
const app =  express();
app.use(bodyParser.json());

const ordersRouter = require('./src/pages/pedidos');
const productsRouter = require('./src/pages/produtos');

app.use('/api/', ordersRouter);
app.use('/api/', productsRouter);

const PORT = 7777;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});