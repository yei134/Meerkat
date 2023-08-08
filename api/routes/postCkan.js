const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

//CKAN_BASE_URI: v6
//CKAN_BASE_URI_2:  nycu
const {CKAN_BASE_URI} = process.env;
const ckanPostPackageCreate = CKAN_BASE_URI+"package_create";

//反映postCkan的正常
router.post('/', async (req, res) => {
  try {
    console.log('ckan post api working well.');
    res.send('ckan post api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

//對ckan做創建資料集請求
router.post('/package_create', async (req, res) => {
  try {
    //做post請求的data參數
    const data = req.body;
    //前端post過來的OauthToken
    const header = req.headers.authorization;
    //包成key-value
    const headers = {"Authorization": header};

    //對ckan平台做post請求
    await axios.post(`${ckanPostPackageCreate}`,data,{headers})
    .then(getRes => {
      console.log(getRes.data);
      res.send(getRes.data);
    })
  } catch (error) {
    //ckan返回請求錯誤的訊息
    console.error(error.response.data.error);
    res.status(500).send('Error fetching data from external API');
  }
});

module.exports = router;