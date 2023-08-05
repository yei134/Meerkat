const { MongoClient } = require('mongodb');
require('dotenv').config();

const {MONGODB_BASE_URI} = process.env;

// 設置MongoDB連接URL和選項
const url = MONGODB_BASE_URI;
const options = { useUnifiedTopology: true };
// 創建MongoDB客戶端
const client = new MongoClient(url, options);
// 建立與資料庫的連接
client.connect((err) => {
  if (err) {
    console.error('can not connect to MongoDB:', err);
  } else {
    console.log('connect to MongoDB successfully.');
  }
});
//連結資料庫
const db = client.db('Meerkat'); 

module.exports = db;