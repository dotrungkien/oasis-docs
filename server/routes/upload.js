var express = require('express');
var router = express.Router();
const { uploadFor } = require('./helpers');
const path = require('path');
var fs = require('fs');

router.post('/', async (req, res) => {
  const { address, token } = req.headers;

  if (!req.files) {
    return res.status(500).send({ msg: 'file is not found' });
  }
  console.log(req.files);
  const myFile = req.files.file;
  await uploadFor(address, myFile);
  res.status(200).send({ msg: 'Upload Successfully.' });
  // const dir = path.resolve('public', 'upload', address);
  // if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  // myFile.mv(path.resolve(dir, myFile.name), function (err) {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send({ msg: 'Error occured' });
  //   }
  //   return res.send({ name: myFile.name, path: `/${myFile.name}` });
  // });
});

module.exports = router;
