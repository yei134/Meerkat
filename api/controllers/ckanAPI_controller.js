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
const ckanGetResourceShow = CKAN_BASE_URI + "resource_show";
const ckanGetPackageSearch = CKAN_BASE_URI+"package_search";

const ckanPostResourceAppend = CKAN_BASE_URI+"resource_create";
const ckanPostResourcePatch = CKAN_BASE_URI+"resource_patch";//把patch改成update，因為url欄位不會自動更新
const ckanPostResourceUpdate = CKAN_BASE_URI+"resource_update";
const ckanPostResourceDelete = CKAN_BASE_URI+"resource_delete";

const tempDirectory = 'uploads/';
const axiosErrMes = 
{
  success: false,
  possible_reason:
    [
      "sent wrong id",
      "can't connect to ckan"
    ]
}
const axiosErrMesJSON = JSON.stringify(axiosErrMes, null, 2);

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
    //前端post過來的ckanToken
    var header = '';
    if(req.headers.authorization){
      header = req.headers.authorization;
    }
    //向ckan做get請求
    axios.get(`${ckanGetPackageList}`,
    {
      headers: {
        Authorization: header
      }
    })
    .then(getRes => {
      res.send(getRes.data);
    })
    .catch(err => {
      console.log(err.response.data.error)
      res.status(500).send(axiosErrMesJSON);
    })
}
exports.getPackageShow = async (req, res) => {
  //將request的查詢參數datasetName拿出
  const searchQuery = req.query.datasetName;
  //前端post過來的ckanToken
  var header = '';
  if(req.headers.authorization){
    header = req.headers.authorization;
  }
  //向ckan做get請求
  axios.get(`${ckanGetPackageShow}`,
  {
    params: {
      id: searchQuery
    },
    headers: {
      Authorization: header
    }
  })
  .then(getRes => {
    res.send(getRes.data);
  })
  .catch(err => {
    console.log(err.response.data.error)
    res.status(500).send(axiosErrMesJSON);
  })
}

exports.getResourceShow = async (req, res) => {
  //將request的查詢參數id拿出
  var resourceID = '';
  try{
    if(req.query.id){
      resourceID = req.query.id;
    }else{
      throw "id is required.";
    }
  }catch(e){
    res.status(e).send(500)
  }
  //前端post過來的ckanToken
  var header = '';
  if(req.headers.authorization){
    header = req.headers.authorization;
  }
  //向ckan做get請求
  axios.get(`${ckanGetResourceShow}`,
  {
    params: {
      id: resourceID
    },
    headers: {
      Authorization: header
    }
  })
  .then(getRes => {
    res.send(getRes.data);
  })
  .catch(err => {
    console.log(err.response)
    res.status(500).send(axiosErrMesJSON);
  })
}

exports.getPackageSearch = async (req, res) => {
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
  axios.get(`${ckanGetPackageSearch}`,
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
    // console.log(getRes.data);
    res.send(getRes.data);
  })
  .catch(err => {
    console.log(err.response.data.error)
    res.status(500).send(axiosErrMesJSON);
  })
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
  var data = "";
  var header = "";
  try{
    //做post請求的data參數
    if(!req.body){
      throw "package infos are required.";
    }else{
      data = req.body;
    }
    //前端post過來的ckanToken
    if(!req.headers.authorization){
      throw "token is required.";
    }else{
      header = req.headers.authorization;
    }
  }catch(e){
    res.status(500).send(e)
  }
  //包成key-value
  const headers = {"Authorization": header};

  // 對ckan平台做post請求
  // private
  var privateData = JSON.parse(JSON.stringify(data));
  privateData.name = privateData.name + "-type-private"
  privateData.private = true
  axios.post(`${ckanPostPackageCreate}`,privateData,{headers})
  .catch(err => {
    console.log(err.response)
    res.status(500).send(axiosErrMesJSON);
  })
  
  // public
  axios.post(`${ckanPostPackageCreate}`,data,{headers})
  .then(res.status(200).send())
  .catch(err => {
    console.log(err.response)
    res.status(500).send(axiosErrMesJSON);
  })
}

exports.postResourceCreate = async (req, res) => {
  try {
    // resourceFile is required or throw error response
    if(req.file){
      //做post請求的data參數
      if(!req.body.package_id){
        throw "package_id is required."
      }
      const packageID = req.body.package_id;
      if(!req.body.resourceName){
        throw "resourceName is required."
      }
      const resourceName = req.body.resourceName;
      var description = "";
      if(req.body.description){
        description = req.body.description;
      }
      //前端post過來的OauthToken
      if(!req.headers.authorization){
        throw "token is required."
      }
      const header = req.headers.authorization;
      //包成key-value
      const headers = 
      {
        Authorization: header,
        "Content-Type": "multipart/form-data"
      };
      // req.files.path 上傳後的臨時路徑
      // req.files.originalname 原本的檔名
      const resourceFile = req.file;
      // traverse每項上傳的檔案
      async function resourcesUpload(){
        //宣告formdata物件
        const formData = new FormData();
        // 將檔案轉成blob屬性
        const resourceContent = fs.readFileSync(resourceFile.path)
        const blob = new Blob([resourceContent], { type: resourceFile.mimetype });
        // console.log(resourceFile)
        formData.append('upload', blob, resourceName);
        // 砍檔案
        fs.unlink(resourceFile.path, (error) => {
          if(error){
            throw "remove temporary resourceFile failed.";
          }
        });
        // package_id is required
        formData.append('package_id', packageID);
        formData.append('name', resourceName);
        formData.append('description', description);

        // 對ckan平台做post請求
        await axios.post(`${ckanPostResourceAppend}`,formData,{headers})
        .then(getRes => {
          res.status(200).send()
        })
        .catch(err =>{
          console.log("err="+err);
        })
      }
      resourcesUpload();
    }else{
      throw "no resourceFile uploaded.";
    }
  } catch (error) {
    //ckan返回請求錯誤的訊息
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
}

exports.postIndexCreate = async (req, res) => {
  //做post請求的data參數
  const packageID = req.body.package_id;
  const symptom = req.body.symptom;
  //前端post過來的OauthToken
  const header = req.headers.authorization;
  //包成key-value
  const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
  //宣告formdata物件
  const formData = new FormData();
  formData.append('package_id', packageID);
  const indexName = packageID + "_[type]_" + symptom
  formData.append('name', indexName);

  //對ckan平台做post請求
  axios.post(`${ckanPostResourceAppend}`,formData,{headers})
  .then(getRes => {
    var resData = 
    {
      id: getRes.data.result.id,
      indexName: getRes.data.result.name
    }
    var resJSONdata = JSON.stringify(resData, null, 2);
    // console.log(resJSONdata);
    res.send(resJSONdata);
  })
  .catch(err => {
    console.log(err.response.data.error)
    res.status(500).send(axiosErrMesJSON);
  })
}

// patch
exports.postResourcePatch = async (req, res) => {
  //做post請求的data參數
  const resourceID = req.body.id;
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
  var description = "";
  if(req.body.description){
    description = req.body.description;
    formData.append('description', description);
  }
  formData.append('name', name);
  if(req.file){
    //將檔案轉成blob屬性
    const blob = new Blob([fileStructure.file.buffer], { type: fileStructure.file.mimetype });
    formData.append('upload', blob, fileStructure.fileName);
    // 砍檔案
    fs.unlink(fileStructure.tempPath, (error) => {
      if (error) {
        throw "remove temporary file failed.";
      }
    });
  }

  //對ckan平台做post請求
  axios.post(`${ckanPostResourcePatch}`,formData,{headers})
  .then(getRes => {
    const mes = 
    {
      success: true
    }
    const mesJSON = JSON.stringify(mes, null, 2);
    res.status(200).send(mesJSON);
  })
  .catch(err => {
    console.log(err.response.data.error)
    res.status(500).send(axiosErrMesJSON);
  })
}

//delete
exports.postResourceDelete = async (req, res) => {
  //做post請求的data參數
  const resourceID = req.body.resource_id;
  //前端post過來的OauthToken
  const header = req.headers.authorization;
  //包成key-value
  const headers = {"Authorization": header};

  var success = []
  var fail = []

  //對ckan平台做post請求
  await resourceID.forEach(element => {
    const postData = {id: element}
    axios.post(`${ckanPostResourceDelete}`, postData, {headers})
    .then(getRes => {
      success.push(element);
    })
    .catch(err => {
      console.log(err.response.data.error)
      fail.push(element);
    })
  })
  var resData = {
    success: success,
    fail: fail
  }
  var resJSONdata = JSON.stringify(resData, null, 2);
  res.status(200).send(resJSONdata);
}