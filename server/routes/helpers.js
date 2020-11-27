require('dotenv').config();
const Parcel = require('@oasislabs/parcel-sdk');

const connectOperator = async () => {
  const operatorConfig = new Parcel.Config({
    apiTokenSigner: {
      clientId: process.env.OASIS_SERVER_CLIENT_ID,
      privateKey: process.env.OASIS_API_PRIVATE_KEY,
    },
  });
  const operatorIdentityAddress = Parcel.Identity.addressFromToken(
    await operatorConfig.tokenProvider.getToken()
  );
  const operatorIdentity = await Parcel.Identity.connect(operatorIdentityAddress, operatorConfig);
  console.log(`Operator connected at address ${operatorIdentity.address.hex}`);
  return { operatorConfig, operatorIdentity };
};

const connectUser = async (address, token) => {
  const identityAddress = new Parcel.Address(address);

  const config = new Parcel.Config({
    apiAccessToken: token,
  });

  const identity = await Parcel.Identity.connect(identityAddress, config);
  console.log(`Connected to Bob's identity at address ${identity.address.hex}`);
  return identity;
};

module.exports.uploadFor = async (address, file) => {
  const { operatorConfig, operatorIdentity } = await connectOperator();
  const userIdentityAddress = new Parcel.Address(address);

  const datasetMetadata = {
    title: file.name,
    // dummy metadata, need to be updated in production
    metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
  };
  const data = file.data;
  console.log(`Uploading data for ${address}`);
  const dataset = await Parcel.Dataset.upload(
    data,
    datasetMetadata,
    await Parcel.Identity.connect(userIdentityAddress, operatorConfig),
    operatorConfig,
    { creator: operatorIdentity }
  );
  console.log(
    `Created dataset with address ${dataset.address.hex} and uploaded to ${dataset.metadata.dataUrl}\n`
  );
};

module.exports.shareTo = async (dataset, config, identity, to) => {
  const policy = await Parcel.WhitelistPolicy.create(
    config,
    identity,
    new Parcel.Set([to])
  );
  await dataset.setPolicy(policy);
  console.log(
    `Created policy with address ${policy.address.hex} and applied it to dataset ${dataset.address.hex}\n`
  );
};

module.exports.getAllFiles = async (address, token) => {
  const datasets = null;
  try {
    const identity = await connectUser(address, token);
    console.log({ identity });
    datasets = await identity.getOwnedDatasets();
  } catch (e) {
    console.log(e);
  }
  return datasets;
};

module.exports.SharedDatasets = async (address, token) => {
  const datasets = null;
  try {
    const identity = await connectUser(address, token);
    console.log({ identity });
    datasets = await identity.getSharedDatasets();
  } catch (e) {
    console.log(e);
  }
  return datasets;
};
