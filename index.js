// index.js (Backend Code)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const products = require('./products.json');

const app = express();
const PORT = 3001;

app.use(cors());

// API URL and API Key
const API_URL = 'https://metals-api.com/api/latest';
const API_KEY = 'mbk7uj8efsx3fag76lp3kzrfq4a09741vo0j32pn4j24i7atkbctpf94vmyl';

app.get('/', (req, res) => {
  res.send('Welcome to the Product API!');
});


// Endpoint to get gold price and update product prices
app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}?access_key=${API_KEY}&symbols=XAU`);
    const goldPrice = response.data.rates.XAU;

    // Update product prices based on gold price
    const updatedProducts = products.map(product => {
      const priceInUSD = (product.popularityScore + 1) * product.weight * goldPrice * 1000 ; // New price formula
      return {
        ...product,
        price: priceInUSD.toFixed(2)
      };
    });

    res.json(updatedProducts);
  } catch (error) {
    console.error('Error while retrieving gold price:', error.message);
    res.status(500).json({ message: 'Failed to retrieve gold price.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
