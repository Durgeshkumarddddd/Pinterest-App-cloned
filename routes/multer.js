
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const Path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
    const unique = uuidv4();
    cb(null,unique + Path.extname(file.originalname));
    }
  })
  const upload = multer({ storage: storage });
  module.exports = upload 