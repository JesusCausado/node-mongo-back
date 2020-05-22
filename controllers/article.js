'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article')

var controller = {

  datosCurso: (req, res) => {
    var hola = req.body.hola;
    return res.status(200).send({
      nombre: "jesus",
      apellido: "causado",
      hola
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller article status ok!"
    });
  },

  save: (req, res) => {
    //Recoger parametros por post
    var params = req.body;

    //Validar datos (validator)
    try {
      var validate_tittle = !validator.isEmpty(params.tittle);
      var validate_content = !validator.isEmpty(params.content);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_tittle && validate_content) {
      //Crear el objeto a guardar
      var article = new Article();

      //Asignar valores
      article.tittle = params.tittle;
      article.content = params.content;
      article.image = null;

      //guardar el articulo
      article.save((err, articleStored) => {
        console.log(articleStored);
        if (err || !articleStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El articulo no se ha guardado'
          });
        }

        //Devolver una respuesta
        return res.status(200).send({
          status: 'success',
          article: articleStored
        });
      })

    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});
    //Ultimos articulos
    var last = req.params.last;
    if (last || last != undefined) query.limit(1);

    query.sort('_id').exec((err, articles) => {
      if (err || !articles) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay articulos para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        articles
      });
    })
  },

  getArticle: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;

    //Comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: 'error',
        messagge: 'Debe enviar el articulo a buscar!'
      });
    }

    //Buscar el articulo
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: 'error',
          message: 'No se encontro el articulo!'
        });
      }

      //Devolver en json
      return res.status(200).send({
        status: 'success',
        article
      });
    })
  },

  update: (req, res) => {
    //Obtener el id del articulo por la url
    var articleId = req.params.id;

    //Recoger los datos que llegan por put
    var params = req.body;

    //Validar datos
    try {
      var validate_tittle = !validator.isEmpty(params.tittle);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(500).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_tittle && validate_content) {
      //Find and update
      Article.findByIdAndUpdate({ _id: articleId }, params, { new: true },
        (err, articleUpdate) => {
          if (err || !articleUpdate) {
            return res.status(500).send({
              status: 'error',
              message: 'Error al actualizar el articulo!'
            });
          }

          return res.status(200).send({
            status: 'success',
            article: articleUpdate
          });
        });
      //Devolver respuesta
    } else {
      return res.status(404).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  delete: (req, res) => {
    //Obtener el id del articulo por la url
    var articleId = req.params.id;

    //Find and Delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err || !articleRemoved) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al borrar el articulo!'
        });
      }

      return res.status(200).send({
        status: 'success',
        article: articleRemoved
      });
    })
  },

  upload: (req, res) => {
    //Configurar el modulo connect multiparty router/article.js

    //Recoger el fichero de la peticion
    var file_name = 'Imagen no subida...';
    var articleId = req.params.id;

    if (!req.files) {
      return res.status(404).send({
        status: 'error',
        message: file_name
      });
    }
    //Fichero
    var file_path = req.files.file0.path;
    var file_split = file_path.split('\\');

    //Advertencia en linux o mac
    //var file_split = file_path.split('/');

    //Nombre del archivo
    var file_name = file_split[2];

    //Extension del archivo
    var extension_split = file_name.split('\.');
    var file_ext = extension_split[1];

    //Comprobar la extension, solo imagenes, sino es valida borrar el fichero
    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg'
      && file_ext != 'gif') {
      // Borro el archivo subido
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: 'error',
          message: 'La extensión de la imagen no es valida!',
        });
      })
    } else {
      //Si todo es valido 

      //Buscar el articulo, asignarle el nombre de la imagen al actualizarlo
      Article.findOneAndUpdate({ _id: articleId }, { image: file_name },
        { new: true }, (err, articleUpdated) => {
          if (err && !articleUpdated) {
            return res.status(200).send({
              status: 'error',
              message: 'Error al guardar la imagen del articulo!'
            });
          }
          return res.status(200).send({
            status: 'success',
            article: articleUpdated
          });
        })

    }

  },//End uploadfile  

  getImage: (req, res) => {
    var file = req.params.image;
    var path_file = './upload/articles/' + file;

    fs.exists(path_file, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(404).send({
          status: 'error',
          message: 'La imagen no existe!!'

        });
      }
    })
  },//End getImage

  search: (req, res) => {
    //Obtener el string a buscar
    var searchString = req.params.search;

    //Find Or
    Article.find({
      "$or": [
        { "tittle": { "$regex": searchString, "$options": "i" } },
        { "content": { "$regex": searchString, "$options": "i" } }
      ]
    })
      .sort([['date', 'descending']])
      .exec((err, articles) => {
        if (err || !articles || articles.length <= 0) {
          console.log(err);
          console.log(articles);
          return res.status(500).send({
            status: 'error',
            message: 'No se encontraron los articulos!'
          });
        }

        return res.status(200).send({
          status: 'success',
          articles
        });
      });
  }//End search

};//End controller

module.exports = controller;