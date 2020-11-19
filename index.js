require('dotenv').config();
const Parcel = require('@oasislabs/parcel-sdk');

async function upload(identity, config) {
  // Now let's upload a dataset.
  const datasetMetadata = {
    title: 'My First Dataset',
    // A (fake) example metadata URL.
    metadataUrl: 'https://docs.oasiscloud.io/latest/logo.png',
  };

  // The dataset: 'hooray!', encoded as a Uint8Array.
  const data = new TextEncoder().encode('hooray!');
  console.log('Uploading data for our user');
  const dataset = await Parcel.Dataset.upload(data, datasetMetadata, identity, config);
  // `dataset.address.hex` is your dataset's unique ID.
  console.log(
    `Created dataset with address ${dataset.address.hex} and uploaded to ${dataset.metadata.dataUrl}`
  );
  return dataset;
}

async function download(identity, dataset, config) {
  // By default, the dataset owner can download the data.
  const datasetToDownload = await Parcel.Dataset.connect(dataset.address, identity, config);
  console.log(`Connected to dataset ${datasetToDownload.address.hex}`);
  const secretDataStream = datasetToDownload.download();
  const secretDatasetWriter = secretDataStream.pipe(
    require('fs').createWriteStream('./data/user_data')
  );

  // Utility method.
  const streamFinished = require('util').promisify(require('stream').finished);
  try {
    await streamFinished(secretDatasetWriter);
    console.log(`Dataset ${datasetToDownload.address.hex} has been downloaded to ./data/user_data`);
  } catch (e) {
    throw new Error(`Failed to download dataset at ${datasetToDownload.address.hex}`);
  }
  const secretData = require('fs').readFileSync('./data/user_data').toString();
  console.log(`Hey dataset owner! Here's your data: ${secretData}\n`);
}

async function main() {
  const configParams = {
    apiTokenSigner: {
      clientId: process.env.OASIS_CLIENT_ID,
      privateKey: process.env.OASIS_API_PRIVATE_KEY,
    },
  };
  const config = new Parcel.Config(configParams);
  const identityAddress = Parcel.Identity.addressFromToken(await config.tokenProvider.getToken());
  // Let's connect to the identity.
  const identity = await Parcel.Identity.connect(identityAddress, config);
  console.log(`Connected to identity at address ${identity.address.hex}`);

  const dataset = await upload(identity, config);
  download(identity, dataset, config);
}
main();
