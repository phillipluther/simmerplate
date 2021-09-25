const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const srcPath = path.resolve('site');
const destPath = path.resolve('public');

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
