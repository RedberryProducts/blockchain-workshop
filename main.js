const {Blockchain, Transaction} = require('./blockchain');
const {Wallet} = require('./wallet');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const wallet = new Wallet();
let rdbrCoin = new Blockchain();
const tx1 = new Transaction(wallet.address, 'some other public key', 10);
wallet.signTransaction(tx1);
rdbrCoin.addTransaction(tx1);

console.log(rdbrCoin.pendingTransactions);
console.log('Starting the miner...');
rdbrCoin.minePendingTransactions(wallet.address);

console.log(rdbrCoin.getBalanceOfAddress(wallet.address));
console.log(JSON.stringify(rdbrCoin, null, 4));