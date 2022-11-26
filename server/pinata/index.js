const pinataSDK = require('@pinata/sdk');
const { pinataConfig } = require('./config');
const pinata = pinataSDK(pinataConfig.APIKey, pinataConfig.APISecret);

module.exports = {
    pinata,
}