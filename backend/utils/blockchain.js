// simplified-microloans/backend/utils/blockchain.js
const { ethers } = require('ethers');
const ABI = require('../../artifacts/contracts/LoanContract.sol/LoanContract.json').abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_API);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, signer);

module.exports = contract;
