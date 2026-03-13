export const BLOCKCHAIN_CONFIG = {
  // Contract Address - Update when deploying to new network
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f',
  
  // Network Configuration
  NETWORK: {
    id: process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID || 11155111, // Sepolia
    name: process.env.REACT_APP_BLOCKCHAIN_NETWORK || 'sepolia',
    rpcUrl: process.env.REACT_APP_RPC_URL || 'https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  
  // API Configuration
  API: {
    baseUrl:
      process.env.REACT_APP_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://dhansetu-api.onrender.com/api'
        : 'http://localhost:5000/api'),
    timeout: 30000,
  },
  
  // MetaMask Configuration
  METAMASK: {
    requiredChainId: 11155111, // Sepolia
    chainHex: '0xaa36a7', // Sepolia chain ID in hex
  },
  
  // Token Decimals
  DECIMALS: 18,
  
  // Transaction Limits & Defaults
  LIMITS: {
    minLoanAmount: 100, // USD
    maxLoanAmount: 50000, // USD
    minDuration: 3, // months
    maxDuration: 60, // months
    gasBuffer: 1.2, // 20% buffer for gas estimation
  },
  
  // Error Messages
  ERRORS: {
    METAMASK_NOT_INSTALLED: 'MetaMask is not installed. Please install it to continue.',
    NETWORK_MISMATCH: 'Please switch to Sepolia network in MetaMask.',
    INSUFFICIENT_FUNDS: 'Insufficient ETH for gas fees. Please add funds.',
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    CONTRACT_ERROR: 'Smart contract call failed. Check Etherscan for details.',
  },
};

export default BLOCKCHAIN_CONFIG;
