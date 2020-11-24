var express = require('express');
var router = express.Router();
const { uploadFor } = require('./helpers');

router.post('/', async (req, res) => {
  const { address, token } = req.headers;

  if (!req.files) {
    return res.status(500).send({ msg: 'file is not found' });
  }

  const myFile = req.files.file;
  await uploadFor(address, myFile);
  // myFile.mv(`${__dirname}/public/upload/${myFile.name}`, function (err) {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send({ msg: 'Error occured' });
  //   }
  //   return res.send({ name: myFile.name, path: `/${myFile.name}` });
  // });
});

module.exports = router;
