const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');
const { configure: configureNunjucks } = require('./build-site/build-site');

const app = express();
const livereloadServer = livereload.createServer();

livereloadServer.watch(path.join(__dirname, '../public'));

app.use(connectLivereload());

configureNunjucks({
  express: app,
  noCache: false,
  watch: true,
});

app.get('/', (req, res) => {
  res.render('index.njk', {});
});

app.get('/demo', (req, res) => {
  res.render('demo.njk');
});

app.listen(8000, () => {
  console.log('Demo site live at http://localhost:8000');
});
