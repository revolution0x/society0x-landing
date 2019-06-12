import * as express from 'express';
import * as path from 'path';
const gatsyExpress = require('gatsby-plugin-express');

const app = express();

app.use(express.static(path.join(__dirname, '../../public/')));
app.use(gatsyExpress('../../gatsby-express.json', {
    publicDir: 'public/',
    template: 'public/404/index.html',
  
    // redirects all /path/ to /path
    // should be used with gatsby-plugin-remove-trailing-slashes
    redirectSlashes: true,
}));

const port = 8000;
app.listen(port);

console.log('App is listening on port ' + port);