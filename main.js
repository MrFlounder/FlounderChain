/*
   Lacks rolling back from detecting invalid state of the chain, peer to peer network to communicate etc.

   Problem 1. Adding blocks too fast, thus spam the chain. Or temper with a block and recalculate all blocks' hash -- hack.
    - Solution: proof of work - you have to proof you make a lot of computing power into make a block - mining.

 */

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        // take all property of the block and hash it
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Computes: " + this.nonce + ", and new block mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "10/07/2018", "Genesis Block");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // In reality we cannot add blocks so easily, e.g Proof of work
    addBlock(newBlock) {
        // set pre hash of the newBlock
        newBlock.previousHash = this.getLatestBlock().calculateHash();
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    mineBlockAndAdd() {
        const newBlock  = new Block(3, "10/10/2018", {amount: "unknown"});
        newBlock.previousHash = this.getLatestBlock().calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }
            if (previousBlock.hash != currentBlock.previousHash) {
                return false;
            }
        }
        return true;
    }
}

let flounderCoin = new BlockChain();
flounderCoin.addBlock(new Block(1, "10/08/2018", {amount: 10}));
flounderCoin.addBlock(new Block(2, "10/09/2018", {amount: 8}));
console.log("Check if valid: " + flounderCoin.isChainValid());
// try temper with a block
flounderCoin.mineBlockAndAdd();
console.log(JSON.stringify(flounderCoin, null, 4));
