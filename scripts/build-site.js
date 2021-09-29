const path = require('path');
const fs = require('fs');
const { SITE_SRC_DIR, SITE_DEST_DIR, STYLES_DEST_DIR } = require('./constants');

if (fs.existsSync(SITE_DEST_DIR)) {
  fs.rmSync(SITE_DEST_DIR, { recursive: true });
}
fs.mkdirSync(SITE_DEST_DIR);

const siteFiles = fs.readdirSync(SITE_SRC_DIR);

siteFiles.forEach((file) => {
  fs.copyFileSync(
    path.join(SITE_SRC_DIR, file),
    path.join(SITE_DEST_DIR, file),
  );
});

// CSS files are required for the demo site; if style assets haven't been built, do so
if (!fs.existsSync(STYLES_DEST_DIR)) {
  require('./build-styles');
}

const cssFiles = fs.readdirSync(STYLES_DEST_DIR);

cssFiles.forEach((file) => {
  fs.copyFileSync(
    path.join(STYLES_DEST_DIR, file),
    path.join(SITE_DEST_DIR, file),
  );
});
