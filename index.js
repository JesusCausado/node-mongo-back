'use sctrict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 4000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
  .then(() => {
    console.log('Bd creada correctamente');

    //Create server
    app.listen(port, () => {
      console.log('Servidor corriendo en http://localhost:' + port);
    });
  });