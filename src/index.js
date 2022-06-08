const express = require('express')
const app = express();

const route = require('./route')

app.use(route);

app.listen(8080, () => console.info('API rodando na porta 8080'))