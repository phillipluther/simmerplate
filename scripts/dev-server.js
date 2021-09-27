const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(connectLivereload());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));

const livereloadServer = livereload.createServer();
livereloadServer.watch(publicPath);

app.get('/:page', (req, res) => {
  const { page = 'index' } = req.params;

  try {
    res.sendFile(path.join(publicPath, `${page}.html`));
  } catch (e) {
    console.error(e);
  }
});

app.listen(8000, () => {
  console.log('Demo site live at http://localhost:8000');
});
