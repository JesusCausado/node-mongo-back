'use strict'

var validator = require('validator');
//var fs = require('fs');
//var path = require('path');

//var Article = require('../models/article')

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller test status ok!"
    });
  },

};//End controller

module.exports = controller;