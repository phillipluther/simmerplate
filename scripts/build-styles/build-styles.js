const sass = require('sass');
const path = require('path');
const fs = require('fs');

const stylesPath = path.resolve('styles');
const destPath = path.resolve('css');
const sansSrc = path.join(stylesPath, 'simmerplate-sans.scss');
const sansDest = path.join(destPath, 'simmerplate-sans.css');
const serifSrc = path.join(stylesPath, 'simmerplate-serif.scss');
const serifDest = path.join(destPath, 'simmerplate-serif.css');

module.exports = () => {
  if (fs.existsSync(destPath)) {
    fs.rmSync(destPath, { recursive: true });
  }
  fs.mkdirSync(destPath);

  const sansContent = sass.renderSync({
    file: sansSrc,
    outputStyle: 'compressed',
  });

  const serifContent = sass.renderSync({
    file: serifSrc,
    outputStyle: 'compressed',
  });

  fs.writeFileSync(sansDest, sansContent.css);
  fs.writeFileSync(serifDest, serifContent.css);
}
