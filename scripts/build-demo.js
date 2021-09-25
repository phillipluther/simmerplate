const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const srcPath = path.resolve('site');
const destPath = path.resolve('public');
const cssPath = path.resolve('css');

nunjucks.configure(srcPath, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});

if (fs.existsSync(destPath)) {
  fs.rmSync(destPath, { recursive: true });
}
fs.mkdirSync(destPath);

fs.readdirSync(srcPath).forEach((filename) => {
  const rendered = nunjucks.render(filename);
  fs.writeFileSync(
    path.join(destPath, filename.replace(/\.njk$/, '.html')),
    rendered,
  );
});

if (!fs.existsSync(cssPath)) {
  const buildStyles = require('./build-stylesheets.js');
}

fs.copyFileSync(
  path.join(cssPath, 'simmerplate-sans.css'),
  path.join(destPath, 'simmerplate-sans.css'),
);

fs.copyFileSync(
  path.join(cssPath, 'simmerplate-serif.css'),
  path.join(destPath, 'simmerplate-serif.css'),
);
