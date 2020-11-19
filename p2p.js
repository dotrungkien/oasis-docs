require('dotenv').config();
const Parcel = require('@oasislabs/parcel-sdk');

async function main() {
  /**
   * Connect Alice Identity
   */
  const configParams = {
    apiTokenSigner: {
      clientId: process.env.OASIS_CLIENT_ID,
      privateKey: process.env.OASIS_API_PRIVATE_KEY,
    },
  };
  const aliceConfig = new Parcel.Config(configParams);
  const identityAddress = Parcel.Identity.addressFromToken(
    await aliceConfig.tokenProvider.getToken()
  );
  const aliceIdentity = await Parcel.Identity.connect(identityAddress, aliceConfig);
  console.log(`Connected to Alice identity at address ${aliceIdentity.address.hex}`);

  /**
   * Connect Bob Identity
   */
  const bobIdentityAddress = new Parcel.Address(process.env.BOB_ADDRESS);
  const bobConfig = new Parcel.Config({
    apiAccessToken: process.env.BOB_TOKEN,
  });

  const bobIdentity = await Parcel.Identity.connect(bobIdentityAddress, bobConfig);
  console.log(`Connected to Bob's identity at address ${bobIdentity.address.hex}`);

  /**
   * Alice upload data for Bob
   */
  const datasetMetadata = {
    title: "Bob's Dataset",
    metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
  };
  const data = new TextEncoder().encode('The weather will be sunny tomorrow.');
  console.log('Uploading data for Bob');
  const dataset = await Parcel.Dataset.upload(
    data,
    datasetMetadata,
    await Parcel.Identity.connect(bobIdentityAddress, aliceConfig),
    aliceConfig,
    { creator: aliceIdentity }
  );
  console.log(
    `Created dataset with address ${dataset.address.hex} and uploaded to ${dataset.metadata.dataUrl}\n`
  );

  /**
   * First attempt download from Alice
   */
  let datasetByAlice = await Parcel.Dataset.connect(dataset.address, aliceIdentity, aliceConfig);

  try {
    console.log(`Attempting to access Bob's data without permission...`);
    await new Promise((resolve, reject) => {
      const decryptedStream = datasetByAlice.download();
      decryptedStream.on('error', reject);
      decryptedStream.on('end', resolve);
    });
    throw new Error('This should not happen.');
  } catch (e) {
    // this is expected
    console.log(`Error: ${e.constructor.name}`);
    console.log("`aliceIdentity` was not able to access Bob's data (expected).\n");
  }

  /**
   * set policy by Bob
   */
  const datasetByBob = await Parcel.Dataset.connect(dataset.address, bobIdentity, bobConfig);
  const policy = await Parcel.WhitelistPolicy.create(
    bobConfig,
    bobIdentity, // The policy creator, and subsequent owner.
    new Parcel.Set([aliceIdentity.address]) // The set of whitelisted identities.
  );
  await datasetByBob.setPolicy(policy);
  console.log(
    `Created policy with address ${policy.address.hex} and applied it to dataset ${datasetByBob.address.hex}\n`
  );

  /**
   * Download by Bob
   */
  const streamFinished = require('util').promisify(require('stream').finished);
  try {
    const secretDataStream = datasetByBob.download();
    const secretDatasetWriter = secretDataStream.pipe(
      require('fs').createWriteStream('./data/bob_data_by_bob')
    );
    await streamFinished(secretDatasetWriter);
    console.log(
      `\nDataset ${datasetByBob.address.hex} has been downloaded to ./data/bob_data_by_bob`
    );
  } catch (e) {
    throw new Error(`Failed to download dataset at ${datasetByBob.address.hex}`);
  }
  const secretDataByBob = require('fs').readFileSync('./data/bob_data_by_bob').toString();
  console.log(`Here's the data: ${secretDataByBob}`);

  /**
   * Second download as Alice
   */
  datasetByAlice = await Parcel.Dataset.connect(dataset.address, aliceIdentity, aliceConfig);
  // const streamFinished = require('util').promisify(require('stream').finished);
  try {
    const secretDataStream = datasetByAlice.download();
    const secretDatasetWriter = secretDataStream.pipe(
      require('fs').createWriteStream('./data/bob_data_by_alice')
    );
    await streamFinished(secretDatasetWriter);
    console.log(
      `\nDataset ${datasetByAlice.address.hex} has been downloaded to ./data/bob_data_by_alice`
    );
  } catch (e) {
    throw new Error(`Failed to download dataset at ${datasetByAlice.address.hex}`);
  }
  const secretDataByAlice = require('fs').readFileSync('./data/bob_data_by_alice').toString();
  console.log(`Here's the data: ${secretDataByAlice}`);
}

main();
