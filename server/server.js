"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var gatsyExpress = require('gatsby-plugin-express');
var app = express();
app.use(express.static(path.join(__dirname, '../../public/')));
app.use(gatsyExpress('../../gatsby-express.json', {
    publicDir: 'public/',
    template: 'public/404/index.html',
    // redirects all /path/ to /path
    // should be used with gatsby-plugin-remove-trailing-slashes
    redirectSlashes: true
}));
var port = 3000;
app.listen(port);
console.log('App is listening on port ' + port);
