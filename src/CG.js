const Web3 = require('web3');
const axios = require('axios');
var SLCContractAddress = '0xbC83d3996bDC072E4Afd37BBF79A902C601bEBa6';
var version = Web3.version.api;
var abi;

async function migrateUsers() {
  try {
    const config = {
      method: 'get',
      url: `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${SLCContractAddress}&apikey=${version}`,
    };
    return new Promise((resolve, reject) => {
      axios(config).then(
        async response => {
          const { data } = response;
          resolve(response);
        },
        err => {
          reject(err);
        },
      );
    });
  } catch (err) {
    throw new BadRequestException(err.message);
  }
}

migrateUsers().then(
  res => {
    console.log(res);
    abi = res.data;
  },
  err => {
    console.log(err);
  },
);
