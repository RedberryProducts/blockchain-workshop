const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fs = require('fs');


class Wallet
{
    constructor(seedPhrase = '')
    {
        seedPhrase === '' ? this.seedPhrase = this.getNewSeedPhrase() : this.seedPhrase = seedPhrase;
        this.privateKey = SHA256(seedPhrase).toString();
        this.keyPair = ec.keyFromPrivate(this.privateKey);
        this.publicKey = this.keyPair.getPublic('hex');
        this.address = this.publicKey;
        console.log(seedPhrase);
        console.log(this.privateKey);
        console.log(this.publicKey);
    }

    signTransaction = transaction => {
        if(this.address !== transaction.fromAddress){
            throw new Error ('You can not sign transactions for other wallets!');
        }

        const hashTx = transaction.calculateHash();
        const sig = this.keyPair.sign(hashTx, 'base64');
        transaction.signature = sig.toDER('hex');
        console.log(transaction.signature);
    }

    getNewSeedPhrase = () => {
        return fs.readFileSync('./bip-0039.txt').toString().split("\n").sort((a, b) => Math.random() - 0.5).slice(0, 12).join(' ');
    }
}

const walletOne = new Wallet();

module.exports.Wallet = Wallet;