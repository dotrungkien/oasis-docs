var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const { getAllFiles } = require('./helpers');

router.get('/', async (req, res) => {
  const { address, token } = req.headers;

  // const datasets = await fetch('https://parcel-sdk.oasiscloud.io/api/state/identity/getDatasets', {
  //   headers: {
  //     authorization: `Bearer ${token}`,
  //     'content-type': 'application/json',
  //   },
  //   body: { identity: address, owned: false },
  //   method: 'POST',
  //   // mode: 'cors',
  // });

  // console.log({ datasets });
  const allDatasets = await getAllFiles(address, token);
  if (!!allDatasets) res.status(200).send(allDatasets);
  else res.status(500).send({ msg: 'no dataset found' });
});

module.exports = router;
