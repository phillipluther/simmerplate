const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');
const fs = require('fs');
const { STYLES_DEST_DIR, SITE_SRC_DIR } = require('./constants');

const app = express();
app.use(connectLivereload());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(SITE_SRC_DIR));

const livereloadServer = livereload.createServer();
livereloadServer.watch([SITE_SRC_DIR, STYLES_DEST_DIR]);

app.get('/:file', (req, res) => {
  const { file = 'index' } = req.params;
  
  if (/\.css$/.test(file)) {
    res.sendFile(path.join(STYLES_DEST_DIR, file));
    return;
  } 

  const htmlFile = path.join(SITE_SRC_DIR, `${file}.html`);
  if (fs.existsSync(htmlFile)) {
    res.sendFile(htmlFile);
    return;
  }

  res.send(404);
});

app.listen(8000, () => {
  console.log('Demo site live at http://localhost:8000');
});
