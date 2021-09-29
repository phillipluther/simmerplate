const sass = require('sass');
const path = require('path');
const fs = require('fs');
const { STYLES_SRC_DIR, STYLES_DEST_DIR } = require('./constants');

const srcFiles = [
  'simmerplate-sans.scss',
  'simmerplate-serif.scss',
];

if (fs.existsSync(STYLES_DEST_DIR)) {
  fs.rmSync(STYLES_DEST_DIR, { recursive: true });
}
fs.mkdirSync(STYLES_DEST_DIR);

srcFiles.forEach((srcFile) => {
  const rendered = sass.renderSync({
    file: path.join(STYLES_SRC_DIR, srcFile),
    outputStyle: 'compressed',
  });

  fs.writeFileSync(
    path.join(STYLES_DEST_DIR, srcFile.replace(/\.scss$/, '.css')),
    rendered.css,
  );
});
