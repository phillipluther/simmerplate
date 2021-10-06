const sass = require('sass');
const path = require('path');
const fs = require('fs');
const { STYLES_SRC_FILE, STYLES_DEST_DIR } = require('./constants');

if (fs.existsSync(STYLES_DEST_DIR)) {
  fs.rmSync(STYLES_DEST_DIR, { recursive: true });
}
fs.mkdirSync(STYLES_DEST_DIR);

const rendered = sass.renderSync({
  file: STYLES_SRC_FILE,
  outputStyle: 'compressed',
});

fs.writeFileSync(
  path.join(STYLES_DEST_DIR, path.basename(STYLES_SRC_FILE.replace(/\.scss$/, '.css'))),
  rendered.css,
);
