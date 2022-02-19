const {Wallet} = require('./wallet');
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash = () => {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    isValid = () => {
        if(this.fromAddress === null) return false;

        if(!this.signature || this.signature.length === 0){
            throw new Error ('No signature in this tranaction');
        }

        const keyPair = ec.keyFromPublic(this.fromAddress, 'hex');
        return keyPair.verify(this.calculateHash(), this.signature);
    }
}



class Block
{
    constructor (timestamp, transactions, previousHash = '')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash = () => {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock = difficulty => {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Nonce Count: ${this.nonce}`);

        console.log(`Block Mined: ${this.hash}`);
    }

    hasValidTransactions = () => {
        for (const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain
{
    constructor ()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock = () => {
        return new Block(Date.now(), "Genesis Block", "0");
    }

    getLatestblock = () => {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions = miningRewardAddress => {
        this.pendingTransactions.push(new Transaction(null, miningRewardAddress, this.miningReward));
        console.log(this.pendingTransactions);
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('Block Successfuly Mined');
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    addTransaction = transaction => {
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error ('Transaction must include from and to address');
        }

        if(!transaction.isValid()){
            throw new Error ('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress = address => {
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid = () => {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

            return true;
        }
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;

const blockOne = new Block('17.02.22', {}, 0);
blockOne.mineBlock(4);

//let rdbrCoin = new Blockchain();

// rdbrCoin.createTransaction(new Transaction('address 1', 'address2', 100));
// rdbrCoin.createTransaction(new Transaction ('address 2', 'address1'), 50);

// console.log('Starting the miner...');
// rdbrCoin.minePendingTransactions('gagas-address');

// console.log(`Balance of Gaga is ${rdbrCoin.getBalanceOfAddress('gagas-address')}`);

// console.log('Starting the miner again...');

// rdbrCoin.minePendingTransactions('gagas-address');

// console.log(`Balance of Gaga is ${rdbrCoin.getBalanceOfAddress('gagas-address')}`);



// console.log('Mining block 1...');
// rdbrCoin.addBlock(new Block(Date.now(), {amount: 4}));

// console.log('Mining block 2...');
// rdbrCoin.addBlock(new Block(Date.now(), {amount: 10}));

//console.log(JSON.stringify(rdbrCoin, null, 4));

// console.log(`Is blockchain Valid ${rdbrCoin.isChainValid()}`);

// rdbrCoin.chain[1].data = { amount: 100 };
// rdbrCoin.chain[1].hash = rdbrCoin.chain[1].calculateHash();

// console.log(`Is blockchain Valid ${rdbrCoin.isChainValid()}`);