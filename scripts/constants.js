const path = require('path');

const BASE_PATH = path.resolve();

const SITE_SRC_DIR = path.join(BASE_PATH, 'site');
const SITE_DEST_DIR = path.join(BASE_PATH, 'public');
const STYLES_SRC_DIR = path.join(BASE_PATH, 'styles');
const STYLES_DEST_DIR = path.join(BASE_PATH, 'css');


module.exports = {
  SITE_SRC_DIR,
  SITE_DEST_DIR,
  STYLES_SRC_DIR,
  STYLES_DEST_DIR,
};
