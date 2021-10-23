const path = require('path');
const fs = require('fs');
const { DEMO_SRC_DIR, DEMO_DEST_DIR, STYLES_DEST_DIR } = require('./constants');

if (fs.existsSync(DEMO_DEST_DIR)) {
  fs.rmSync(DEMO_DEST_DIR, { recursive: true });
}
fs.mkdirSync(DEMO_DEST_DIR);

const demoFiles = fs.readdirSync(DEMO_SRC_DIR);

demoFiles.forEach((file) => {
  fs.copyFileSync(
    path.join(DEMO_SRC_DIR, file),
    path.join(DEMO_DEST_DIR, file),
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
    path.join(DEMO_DEST_DIR, file),
  );
});
