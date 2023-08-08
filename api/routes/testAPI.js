const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    console.log('API is working properly');
    res.send('API is working properly');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

module.exports = router;