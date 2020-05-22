'use sctrict'

//Cargar modulos de node para el server
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express(http)
var app = express();

//Cargar ficheros rutas
var article_routes = require('./routes/article');

//MiddLewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


//Añadir prefijos y rutas
app.use(article_routes);

//Exportar modulo (fichero actual)
module.exports = app;