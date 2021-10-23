const path = require('path');

const BASE_PATH = path.resolve();

const DEMO_SRC_DIR = path.join(BASE_PATH, 'demo');
const DEMO_DEST_DIR = path.join(BASE_PATH, 'public');
const STYLES_SRC_DIR = path.join(BASE_PATH, 'styles');
const STYLES_SRC_FILE = path.join(STYLES_SRC_DIR, 'simmerplate.scss');
const STYLES_DEST_DIR = path.join(BASE_PATH, 'css');

module.exports = {
  DEMO_SRC_DIR,
  DEMO_DEST_DIR,
  STYLES_SRC_DIR,
  STYLES_SRC_FILE,
  STYLES_DEST_DIR,
};
