const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const SRC_PATH = path.resolve('site');
const DEST_PATH = path.resolve('public');
const CSS_PATH = path.resolve('css');

function configure(userOptions = {}) {
  nunjucks.configure(SRC_PATH, {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
      ...userOptions
  });
}

function build(userOptions = {}) {
  configure(userOptions);

  if (fs.existsSync(DEST_PATH)) {
    fs.rmSync(DEST_PATH, { recursive: true });
  }
  fs.mkdirSync(DEST_PATH);

  fs.readdirSync(SRC_PATH).forEach((filename) => {
    const rendered = nunjucks.render(filename);
    fs.writeFileSync(
      path.join(DEST_PATH, filename.replace(/\.njk$/, '.html')),
      rendered,
    );
  });

  if (!fs.existsSync(CSS_PATH)) {
    require('../build-styles');
  }

  fs.copyFileSync(
    path.join(CSS_PATH, 'simmerplate-sans.css'),
    path.join(DEST_PATH, 'simmerplate-sans.css'),
  );

  fs.copyFileSync(
    path.join(CSS_PATH, 'simmerplate-serif.css'),
    path.join(DEST_PATH, 'simmerplate-serif.css'),
  );
}

module.exports = { build, configure };
