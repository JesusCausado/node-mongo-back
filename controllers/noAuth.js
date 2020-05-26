'use strict'

var validator = require('validator');
var jwt = require('jsonwebtoken');

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller noAut status ok!"
    });
  },

  login: (req, res) => {
    var username = req.body.user
    var password = req.body.password

    if (!(username === 'jesus' && password === '123')) {
      res.status(401).send({
        error: 'usuario o contraseña inválidos'
      })
      return
    }

    var tokenData = {
      username: username
      // ANY DATA
    }

    var token = jwt.sign(tokenData, 'Secret Password', {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    })

    return res.status(200).send({
      token
    });
  }

};//End controller

module.exports = controller;