const fs = require('fs');
const path = require('path');

const noSuchFileCode = 'ENOENT';
const fileExistsCode = 'EEXIST';

function sortDirectory(messyDir, sortedDir, shouldDelete) {
  function handleError(err) {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
  }

  function checkForDirectory(filepath, callback) {
    fs.lstat(filepath, (err, stats) => {
      handleError(err);

      callback(filepath, stats.isDirectory());
    })
  }

  function moveFile(filepath, newFileDir) {
    const basename = path.basename(filepath);
      
    fs.readFile(filepath, (err, data) => {
      handleError(err);

      const newFilePath = path.join(newFileDir, basename);
      fs.writeFile(newFilePath, data, err => {
        handleError(err);
      })
    })  
  }

  function distributeFile(filepath) {
    const basename = path.basename(filepath),
      firstLetter = basename.charAt(0).toUpperCase(),
      newFileDir = path.join(sortedDir, firstLetter);

    fs.stat(newFileDir, (err, stats) => {
      if (err) {
        if (err.code === noSuchFileCode) {

          fs.mkdir(newFileDir, err => {
            if (err) {
              if (err.code !== fileExistsCode)
                handleError(err);
            }

            moveFile(filepath, newFileDir);
          })
        } else {
          handleError(err);        
        }
      }

      moveFile(filepath, newFileDir);
    })
  }

  function processFile(dirname, isDirectory) {
    if (isDirectory) {
      fs.readdir(path.resolve(__dirname, dirname), (err, files) => {
        handleError(err);

        files.forEach((item, index) => {
          const itemPath = path.join(dirname, item);
          checkForDirectory(itemPath, processFile);
        });
      });
    }
    else {
      distributeFile(dirname);
    }
  }

  if (!fs.existsSync(sortedDir)) {
    fs.mkdirSync(sortedDir);
  }

  checkForDirectory(messyDir, processFile);
}

module.exports = sortDirectory;