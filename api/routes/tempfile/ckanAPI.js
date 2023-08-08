const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

//CKAN_BASE_URI: v6
//CKAN_BASE_URI_2:  nycu
const {CKAN_BASE_URI} = process.env;
const ckanPostPackageCreate = CKAN_BASE_URI+"package_create";
const ckanGetPackageList = CKAN_BASE_URI+"package_list";
const ckanGetPackageShow = CKAN_BASE_URI+"package_show";

/*********************************/
/***************GET***************/
/*********************************/

//反映get正常
router.get('/', async (req, res) => {
  try {
    console.log('ckan get api working well.');
    res.send('ckan get api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

//資料集列表
router.get('/package_list', async (req, res) => {
  try {
    const response = await axios.get(ckanGetPackageList);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

//詳細資料集資訊
router.get('/package_show', async (req, res) => {
  try {
    //將request的查詢參數datasetName拿出
    const searchQuery = req.query.datasetName;
    //console.log('\n'+JSON.stringify(req.query))
    //向ckan做get請求
    await axios.get(`${ckanGetPackageShow}`,
    {
      params: {
        id: searchQuery
      }
    })
    .then(getRes => {
      console.log(getRes.data);
      res.send(getRes.data);
    })
  } catch (error) {
    console.error(error.response.data.error);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send('Error fetching data from external API');
  }
});

/**********************************/
/***************POST***************/
/**********************************/

//反映post的正常
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

/************************************/
/***************DELETE***************/
/************************************/

/*********************************/
/***************PUT***************/
/*********************************/

module.exports = router;