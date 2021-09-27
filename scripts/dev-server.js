const express = require('express');
const { configure: configureNunjucks } = require('./build-site/build-site');

const app = express();

configureNunjucks({
  watch: true,
});

app.get('/', (req, res) => {
  res.send('OK!');
});

app.listen(8000, () => {
  console.log('Demo site live at http://localhost:8000');
});
