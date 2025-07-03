const crypto = require('crypto');
const secret = process.env.KYC_SECRET || 'secretkey';

// Generate 32-byte key from secret
const KEY = crypto.createHash('sha256').update(secret).digest(); // 32 bytes for AES-256
const ALGORITHM = 'aes-256-cbc';

exports.encryptKYC = (data) => {
  if (!data || typeof data !== 'string') {
    throw new Error("Invalid Aadhaar data provided for encryption.");
  }

  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

exports.decryptKYC = (encrypted) => {
  const [ivHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
