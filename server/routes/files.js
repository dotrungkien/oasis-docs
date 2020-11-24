var express = require('express');
var router = express.Router();
const { getAllFiles } = require('./helpers');

router.get('/', async (req, res) => {
  const { address, token } = req.headers;
  const allDatasets = await getAllFiles(address, token);
  if (!!allDatasets) res.status(200).send(allDatasets);
  else res.status(500).send({ msg: 'no dataset found' });
});

module.exports = router;
