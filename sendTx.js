
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

const gasPrice = web3.utils.toWei("2000000","Gwei");

const MAXGASTOTAL = readWeb3.utils.toWei("1000", "ether");

const TIME = 10000;

//const sleep = require("sleep");


let getCount = (gasPrice) => {
    let count = new bigNumber(bigNumber(MAXGASTOTAL).div(bigNumber(gasPrice)).minus(bigNumber("21000"))).dividedToIntegerBy(bigNumber("513"));
    return count.toNumber();

};


const send = async (i) => {
  //console.log(msg_senders);

  let sha3 = web3.utils.soliditySha3(msg_senders);

  let count = getCount(gasPrice);

    console.log('========================================================================', count);

  let sendData = '0x' + sha3.substr(2).repeat(count);

    //web3.eth.accounts.wallet.add(privateKey);

    // await web3.eth.sendTransaction({
    //     from: msg_senders,
    //     to: msg_senders,
    //     data: sendData,
    //     gas: "500000",
    //     gasPrice: gasPrice
    // }).on('transactionHash', function (hash) {
    //     console.log("hash: ", hash);
    // });

  
  // 4. Sign tx with PK
  const createTransaction = await  web3.eth.accounts.signTransaction(
    {
      gas: '21000',
      to: msg_senders,
      gasPrice: gasPrice,
      nonce: await readWeb3.eth.getTransactionCount(msg_senders),
      data: "0x"
    },
    privateKey
  );

  // 5. Send tx and wait for receipt
   await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );

    console.log("=============", i);

};

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

// 6. Call send function
let run = async() => {
    // web3.eth.accounts.wallet.add(privateKey);
   // timer =  setInterval(send,TIME);
    for (i = 0; i < 10000; i++) {
        //sleep.msleep(30000);
        await sleep(3000);
        try { 
             await send(i);
        }catch(err){
            console.log(err);
        }
        console.log('success: ', i);
    }
}

run();
