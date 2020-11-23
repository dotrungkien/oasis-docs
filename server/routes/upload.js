var express = require('express');
const path = require('path');
const Resize = require('./Resize');
var router = express.Router();
const upload = require('./uploadMiddleware');

router.post('/', upload.single('image'), async function (req, res) {
  // folder upload
  const imagePath = path.join(__dirname, '/upload-images');
  // call class Resize
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({ error: 'Please provide an image' });
  }
  const filename = await fileUpload.save(req.file.buffer);

  return res.status(200).json({ name: filename });
});

module.exports = router;
