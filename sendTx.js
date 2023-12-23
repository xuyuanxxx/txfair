
// {...}
var {Web3} = require("web3");

const WRITERPCURL = 'https://rpc.zkfair.io';

const READRPCURL = 'https://dev-rpc.zkfair.io';

let web3 = new Web3(new Web3.providers.HttpProvider(WRITERPCURL));

let readWeb3 = new Web3(new Web3.providers.HttpProvider(READRPCURL));

const bigNumber = require("bignumber.js");

var rf = require("fs"); 

const msg_senders = rf.readFileSync("./aaa.txt", "utf-8").replaceAll("\r", "").replaceAll("\n", "").trim();

// console.log("msg_senders: ",msg_senders);

const privateKey = rf.readFileSync("./ppp.txt", "utf-8").replaceAll("\r", "").replaceAll("\n", "").trim();

const gasPrice = web3.utils.toWei("20000","Gwei");

const MAXGASTOTAL = readWeb3.utils.toWei("10", "ether");


let getCount = (gasPrice) => {
    let count = new bigNumber(bigNumber(MAXGASTOTAL).div(bigNumber(gasPrice)).minus(bigNumber("21000"))).dividedToIntegerBy(bigNumber("513"));
    return count.toNumber();

};


const send = async (i) => {

  let sha3 = web3.utils.soliditySha3(msg_senders);

  let count = getCount(gasPrice);

  let sendData = '0x' + sha3.substr(2).repeat(count);

  
  // 4. Sign tx with PK
  const createTransaction = web3.eth.accounts.signTransaction(
    {
      gas: '500000',
      to: msg_senders,
      gasPrice: gasPrice,
      nonce: await readWeb3.eth.getTransactionCount(msg_senders),
      data: sendData
    },
    privateKey
  );

  // 5. Send tx and wait for receipt
   web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );

};

// 6. Call send function
let run = async() => {
    for (i = 0; i < 10000; i++) {
        try { 
             await send(i);
        }catch(err){
            console.log(err);
        }
        console.log('success: ', i);
    }
}

run();
