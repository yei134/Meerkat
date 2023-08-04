const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

//CKAN_BASE_URI: v6
//CKAN_BASE_URI_2:  nycu
const {CKAN_BASE_URI} = process.env;
const ckanGetPackageList = CKAN_BASE_URI+"package_list";
const ckanGetPackageShow = CKAN_BASE_URI+"package_show";

//反映ckan_get正常
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

module.exports = router;