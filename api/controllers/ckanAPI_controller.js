const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

//CKAN_BASE_URI: v6
//CKAN_BASE_URI_2:  nycu
const {CKAN_BASE_URI} = process.env;
const ckanPostPackageCreate = CKAN_BASE_URI+"package_create";

const ckanGetPackageList = CKAN_BASE_URI+"package_list";
const ckanGetPackageShow = CKAN_BASE_URI+"package_show";
const ckanGetPackageSearch = CKAN_BASE_URI+"package_search";

const ckanPostResourceAppend = CKAN_BASE_URI+"resource_create";
const ckanPostResourcePatch = CKAN_BASE_URI+"resource_patch";
const ckanPostResourceDelete = CKAN_BASE_URI+"resource_delete";

const tempDirectory = 'uploads/';

// get
exports.checkGet = async (req, res) => {
  try {
    console.log('ckan get api working well.');
    res.send('ckan get api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
}
exports.getPackageList = async (req, res) => {
  try {
    //前端post過來的ckanToken
    var header = '';
    if(req.headers.authorization){
      header = req.headers.authorization;
    }
    const response = await axios.get(ckanGetPackageList,
      {
        headers: {
        'Authorization': header
        }
      }
    );
    console.log(req.headers);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
}
exports.getPackageShow = async (req, res) => {
  try {
    //將request的查詢參數datasetName拿出
    const searchQuery = req.query.datasetName;
    //前端post過來的ckanToken
    var header = '';
    if(req.headers.authorization){
      header = req.headers.authorization;
    }
    //console.log('\n'+JSON.stringify(req.query))
    // console.log(header);
    //向ckan做get請求
    await axios.get(`${ckanGetPackageShow}`,
    {
      params: {
        id: searchQuery
      },
      headers: {
        'Authorization': header
      }
    })
    .then(getRes => {
      console.log(getRes.data);
      // console.log(getRes.headers);
      res.send(getRes.data);
    })
  } catch (error) {
    console.error(error.response);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send('Error fetching data from external API');
  }
}
exports.getPackageSearch = async (req, res) => {
  try{
    /*
      ※CKAN API package_search params參數簡述

      include_private: 是否包含顯示不公開資料集
      start: 第n個資料集開始顯示
      rows: 限制顯示n個資料集
      q: 搜尋相關字詞

    */
    var searchQuery = null;
    var start = 0;
    var rows = null;
    //將request的查詢參數們拿出
    if(req.query.searchQuery){
      searchQuery = req.query.searchQuery;
    }
    if(req.query.begin){
      start = req.query.begin;
    }
    if(req.query.limit){
      rows = req.query.limit;
    }
    //前端傳過來的ckanToken
    var header = '';
    if(req.headers.authorization){
      header = req.headers.authorization;
    }
    //向ckan做get請求
    await axios.get(`${ckanGetPackageSearch}`,
    {
      params: {
        include_private: true,
        start: start,
        rows: rows,
        q:searchQuery
      },
      headers: {
        'Authorization': header
      }
    })
    .then(getRes => {
      console.log(getRes.data);
      // console.log(getRes.headers);
      res.send(getRes.data);
    })
  }catch(error){
    console.error(error.response);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send('Error fetching data from external API');
  }
}
// post
exports.checkPost = async (req, res) => {
  try {
    console.log('ckan post api working well.');
    res.send('ckan post api working well.');
  } catch (error) {
    console.error(error.response.data.error);
    res.status(500).send('Error fetching data from external API');
    return;
  }
}
exports.postPackageCreate = async (req, res) => {
  try {
    //做post請求的data參數
    const data = req.body;
    //前端post過來的ckanToken
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
    return;
  }
}
exports.postResourceCreate = async (req, res) => {
  try {
    //做post請求的data參數
    const packageID = req.body.package_id;
    const description = req.body.description;
    const name = req.body.resourceName;
    //前端post過來的OauthToken
    const header = req.headers.authorization;
    //包成key-value
    const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
    //宣告formdata物件
    const formData = new FormData();
    // 將基本CSV轉成blob屬性
    const baseCSV = `./base.csv`;
    const fileStream = fs.createReadStream(baseCSV);
    const blob = new Blob([fileStream]);
    formData.append('upload', blob, file);
    // 創建病徵的dicom資料夾
    // 隨後的raccoonAPI的ldcm2csv會用到
    const symptomFolder = tempDirectory + "_type_" + name + "/";
    if (!fs.existsSync(symptomFolder)) {
      fs.mkdirSync(symptomFolder);
    }
    formData.append('package_id', packageID);
    formData.append('description', description);
    formData.append('name', name);
    formData.append('upload', blob, fileName);

    //對ckan平台做post請求
    await axios.post(`${ckanPostResourceAppend}`,formData,{headers})
    .then(getRes => {
      console.log(getRes.data);
      res.send(getRes.data);
    })
  } catch (error) {
    //ckan返回請求錯誤的訊息
    console.error(error.response.data.error);
    res.status(500).send('Error fetching data from external API');
    return;
  }
}

// patch
exports.postResourcePatch = async (req, res) => {
  try {
    //做post請求的data參數
    const resourceID = req.body.id;
    const description = req.body.description;
    const name = req.body.resourceName;
    //前端post過來的OauthToken
    const header = req.headers.authorization;
    //包成key-value
    const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
    // 'resourceFile' 是表單中的檔案欄位名稱

    var fileStructure = {
      file: undefined,
      tempPath: undefined,
      fileName: undefined,
    };
    if(req.file){
      fileStructure.file = req.file;
      fileStructure.tempPath = req.file.path; //上傳後的臨時路徑
      fileStructure.fileName = req.file.originalname; // 原本的檔名  
    }
    // const file = req.file;
    // const tempPath = req.file.path; //上傳後的臨時路徑
    // const fileName = req.file.originalname; // 原本的檔名

    //宣告formdata物件
    const formData = new FormData();
    formData.append('id', resourceID);
    formData.append('description', description);
    formData.append('name', name);
    if(req.file){
      //將檔案轉成blob屬性
      const blob = new Blob([fileStructure.file.buffer], { type: fileStructure.file.mimetype });
      formData.append('upload', blob, fileStructure.fileName);
      // 砍檔案
      fs.unlink(fileStructure.tempPath, (error) => {
        if (error) {
          console.error(error);
          return;
        }
      });
    }

    //對ckan平台做post請求
    await axios.post(`${ckanPostResourcePatch}`,formData,{headers})
    .then(getRes => {
      console.log(getRes.data);
      res.send(getRes.data);
    })
  } catch (error) {
    //ckan返回請求錯誤的訊息
    console.error(error.response.data.error);
    res.status(500).send('Error fetching data from external API');
    return;
  }
}

//delete
exports.postResourceDelete = async (req, res) => {
  try {
    //做post請求的data參數
    const resourceID = req.body.resource_id;
    //前端post過來的OauthToken
    const header = req.headers.authorization;
    //包成key-value
    const headers = {"Authorization": header};

    //對ckan平台做post請求
    await resourceID.forEach(element => {
      const postData = {id: element}
      axios.post(`${ckanPostResourceDelete}`, postData, {headers})
      .then(getRes => {
        console.log(getRes.data);
      })
    });
    res.sendStatus(200);
  } catch (error) {
    //ckan返回請求錯誤的訊息
    console.error(error.response.data.error);
    res.status(500).send('Error fetching data from external API');
    return;
  }
}