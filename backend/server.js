// simplified-microloans/backend/server.js
const app = require('./app');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
