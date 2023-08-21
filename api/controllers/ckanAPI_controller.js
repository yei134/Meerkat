const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

//CKAN_BASE_URI: v6
//CKAN_BASE_URI_2:  nycu
const {CKAN_BASE_URI} = process.env;
const ckanPostPackageCreate = CKAN_BASE_URI + "package_create";

const ckanGetPackageList = CKAN_BASE_URI + "package_list";
const ckanGetGroupList = CKAN_BASE_URI + "group_list";
const ckanGetTagList = CKAN_BASE_URI + "group_list";
const ckanGetOrgList = CKAN_BASE_URI + "organization_list";
const ckanGetGroupPackageList = CKAN_BASE_URI + "group_package_show";
const ckanGetTagPackageList = CKAN_BASE_URI + "tag_show";
const ckanGetOrgPackageList = CKAN_BASE_URI + "organization_show";
const ckanGetPackageShow = CKAN_BASE_URI + "package_show";
const ckanGetResourceShow = CKAN_BASE_URI + "resource_show";
const ckanGetPackageSearch = CKAN_BASE_URI + "package_search";

const ckanPostResourceAppend = CKAN_BASE_URI + "resource_create";
const ckanPostResourcePatch = CKAN_BASE_URI + "resource_patch";//把patch改成update，因為url欄位不會自動更新
const ckanPostResourceUpdate = CKAN_BASE_URI + "resource_update";
const ckanPostResourceDelete = CKAN_BASE_URI + "resource_delete";

const tempDirectory = 'uploads/';
const resourceSplitName = "_[type]_"
const packageSplitName = "-type-private"
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
      console.log(err)
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
    console.log(err)
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
    console.log(err)
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
    console.log(err)
    res.status(500).send(axiosErrMesJSON);
  })
}

// 回傳指定層級陣列所帶的值
function objTraverse(data, keys) {
  let result = data;
  for (const key of keys) {
    if (result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
}

// params:{},URL,token,要的子層陣列
async function getCommonListOrCommonPackageList(reqParams, url, token, keys){
  if(reqParams){
    // for xxx_show
    console.log(reqParams)
    try{
      const getRes = await axios.get(url,
      {
        params: reqParams,
        headers: {
          Authorization: token
        }
      });
      const response = getRes.data.result;
      var resData = {}
      if(keys){
        const responseINkeys = objTraverse(response,keys);
        resData = 
        {
          success: 200,
          data: responseINkeys
        }
      }else{
        resData = 
        {
          success: 200,
          data: response
        }
      }
      return resData;
    }catch(err){
      console.log(err);
      const resData = 
      {
        success: 500,
        data: err
      }
      return resData;
    }
  }else{
    // for xxxx_list
    try{
      const getRes = await axios.get(url,
      {
        headers: {
          Authorization: token
        }
      });
      const response = getRes.data.result;
      var resData = {}
      if(keys){
        const responseINkeys = objTraverse(response,keys);
        resData = 
        {
          success: 200,
          data: responseINkeys
        }
      }else{
        resData = 
        {
          success: 200,
          data: response
        }
      }
      return resData;
    }catch(err){
      console.log(err);
      const resData = 
      {
        success: 500,
        data: err
      }
      return resData;
    }
  }
}

exports.getGroupList = async (req, res) => {
  // params:{},URL,token,要的子層陣列
  await getCommonListOrCommonPackageList(null,ckanGetGroupList,null,null)
  .then(getRes => {
    const status = getRes.success;
    const data = getRes.data;
    res.status(status).send(data);
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err);
  })
}
exports.getTagList = async (req, res) => {
  // params:{},URL,token,要的子層陣列
  await getCommonListOrCommonPackageList(null,ckanGetTagList,null,null)
  .then(getRes => {
    const status = getRes.success;
    const data = getRes.data;
    res.status(status).send(data);
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err);
  })
}
exports.getOrgList = async (req, res) => {
  // params:{},URL,token,要的子層陣列
  await getCommonListOrCommonPackageList(null,ckanGetOrgList,null,null)
  .then(getRes => {
    const status = getRes.success;
    const data = getRes.data;
    res.status(status).send(data);
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err);
  })
}
exports.getGroupPackageList = async (req, res) => {
  const id = req.query.id;
  const params = {
    id: id
  }
  //前端post過來的ckanToken
  var header = '';
  if(req.headers.authorization){
    header = req.headers.authorization;
  }
  // params:{},URL,token,要的子層陣列
  await getCommonListOrCommonPackageList(params,ckanGetGroupPackageList,header,null)
  .then(getRes => {
    const status = getRes.success;
    const data = getRes.data;
    res.status(status).send(data);
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err);
  })
}
exports.getTagPackageList = async (req, res) => {
  const id = req.query.id;
  const params = {
    id: id,
    include_datasets: true
  }
  //前端post過來的ckanToken
  var header = '';
  if(req.headers.authorization){
    header = req.headers.authorization;
  }
  const keys = ["packages"]
  // params:{},URL,token,要的子層陣列
  await getCommonListOrCommonPackageList(params,ckanGetTagPackageList,header,keys)
  .then(getRes => {
    const status = getRes.success;
    const data = getRes.data;
    res.status(status).send(data);
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err);
  })
}
exports.getOrgPackageList = async (req, res) => {
  const id = req.query.id;
  const params = {
    id: id,
    include_datasets: true
  }
  //前端post過來的ckanToken
  var header = '';
  if(req.headers.authorization){
    header = req.headers.authorization;
  }
  const keys = ["packages"]
  // params:{},URL,token,要的子層陣列
  await getCommonListOrCommonPackageList(params,ckanGetOrgPackageList,header,keys)
  .then(getRes => {
    const status = getRes.success;
    const data = getRes.data;
    res.status(status).send(data);
  })
  .catch(err => {
    console.log(err)
    res.status(500).send(err);
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
  privateData.name = privateData.name + packageSplitName
  privateData.private = true
  axios.post(`${ckanPostPackageCreate}`,privateData,{headers})
  .catch(err => {
    console.log(err)
    res.status(500).send(axiosErrMesJSON);
  })
  
  // public
  axios.post(`${ckanPostPackageCreate}`,data,{headers})
  .then(res.status(200).send())
  .catch(err => {
    console.log(err)
    res.status(500).send(axiosErrMesJSON);
  })
}

exports.postResourceCreate = async (req, res) => {
  try {
    // resourceFile is required or throw error response
    if(req.file){
      //做post請求的data參數
      var privatePackageID = "";
      var publicPackageID = "";
      if(req.body.package_id){
        privatePackageID = req.body.package_id;
        const str = privatePackageID.split(packageSplitName)
        publicPackageID = str[0];
      }else{
        throw "package_id is required."
      }

      var resourceName = "";
      if(req.body.resourceName){
        resourceName = req.body.resourceName;
        const str = resourceName.split(resourceSplitName)
        if(str.length > 1){
          throw resourceName + " contains prohibited words."
        }
      }else{
        throw "resourceName is required."
      }

      //前端post過來的OauthToken
      var header = "";
      if(req.headers.authorization){
        header = req.headers.authorization; 
      }else{
        throw "token is required."
      }

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
        const privateFormData = new FormData();
        const publicFormData = new FormData();
        // 將檔案轉成blob屬性
        const resourceContent = fs.readFileSync(resourceFile.path)
        const blob = new Blob([resourceContent], { type: resourceFile.mimetype });
        privateFormData.append('upload', blob, resourceName);
        publicFormData.append('upload', blob, resourceName);
        // 砍檔案
        fs.unlink(resourceFile.path, (error) => {
          if(error){
            throw "remove temporary resourceFile failed.";
          }
        });
        // package_id is required
        privateFormData.append('package_id', privatePackageID);
        publicFormData.append('package_id', publicPackageID);
        privateFormData.append('name', resourceName);
        publicFormData.append('name', resourceName);

        var errLog = [];
        var publicResourceUID = "";
        var prefixDes = 'public resource uid:'
        if(publicFlag){
          // 對ckan平台做post請求(公有資料集)
          await axios.post(`${ckanPostResourceAppend}`,publicFormData,{headers})
          .then(getRes => {
            publicResourceUID = getRes.data.result.id;
            const completeDes = prefixDes + publicResourceUID
            privateFormData.append('description', completeDes);
          })
          .catch(err =>{
            console.log("err="+err);
            errLog.push(err);
          })
        }else{
          privateFormData.append('description', prefixDes);
        }
        // 對ckan平台做post請求(私有資料集)
        await axios.post(`${ckanPostResourceAppend}`,privateFormData,{headers})
        .catch(err =>{
          console.log("err="+err);
          errLog.push(err);
        })
        if(errLog.length > 0){
          res.status(500).send(errLog)
        }else{
          res.status(200).send()
        }
      }
      var publicFlag = true;
      async function checkPackageStatus(){
        await axios.get(`${ckanGetPackageShow}`,
          {
            params: { id: privatePackageID },
            headers
          }
        )
        .then(getRes => {
          console.log("private dataset exist.");
        })
        .catch(err => {
          res.status(500).send("private dataset doesn't exist")
        })

        await axios.get(`${ckanGetPackageShow}`,
        {
          params: { id: publicPackageID },
          headers
        }
        )
        .then(getRes => {
          console.log("public dataset exist.");
          publicFlag = true;
        })
        .catch(err => {
          console.log("public dataset doesn't exist")
          publicFlag = false;
        })
        resourcesUpload();
      }
      checkPackageStatus()
    }else{
      throw "no resourceFile uploaded.";
    }
  } catch (err) {
    //ckan返回請求錯誤的訊息
    console.log(err);
    res.status(500).send(err);
  }
}

exports.postIndexCreate = async (req, res) => {
  //做post請求的data參數
  var packageID = "";
  var symptoms = [];
  //前端post過來的ckanToken
  var header = "";
  try{
    if(req.body.package_id){
      packageID = req.body.package_id
    }else{
      throw "package_id is required.";
    }
    if(req.body.symptoms){
      symptoms = req.body.symptoms
    }else{
      throw "symptom(type:array) is required."
    }
    if(req.headers.authorization){
      header = req.headers.authorization
    }else{
      throw "token is required."
    }
  }catch(e){
    res.status(500).send(e)
  }
  var success = [] ;
  var fail = [] ;
  async function indexCreate(){
    for(let i = 0 ; i < symptoms.length ; i++){
      //包成key-value
      const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
      //宣告formdata物件
      const formData = new FormData();
      formData.append('package_id', packageID);
      const indexName = packageID + resourceSplitName + symptoms[i]
      formData.append('name', indexName);
  
      //對ckan平台做post請求
      await axios.post(`${ckanPostResourceAppend}`,formData,{headers})
      .then(getRes => {
        success.push(symptoms[i]);
      })
      .catch(err => {
        console.log(err);
        fail.push(symptoms[i]);
      })
    }
    // var resData = 
    // {
    //   status: 200,
    //   package_id: packageID,
    //   success: success,
    //   fail: fail
    // }
    // var resJSONdata = JSON.stringify(resData, null, 2);
    // res.send(resJSONdata);
    res.status(200).send()
  }
  indexCreate();
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
    console.log(err)
    res.status(500).send(axiosErrMesJSON);
  })
}

//delete
exports.delResourceDelete = (req, res) => {
  var resourceID = "";
  var header = "";
  try{
    //做post請求的data參數
    if(req.body.resource_id){
      resourceID = req.body.resource_id;
    }else{
      throw "resource_id is required."
    }
    //前端post過來的OauthToken
    if(req.headers.authorization){
      header = req.headers.authorization;
    }else{
      throw "token is required."
    }
  }catch(e){
    console.log(e)
    res.status(500).send(e);
  }

  const headers = {"Authorization": header};

  var filteredResourceID =[]
  var success = []
  var fail = []
  var publicResourceUIDarray = []
  
  // 對ckan平台做get請求
  // 先比對請求陣列中的名字有沒有特殊格式
  // filteredResourceID是「沒有特殊格式」的附件ID
  async function checkSplitName(){
    for(var i = 0 ; i < resourceID.length ; i++){
      const getData = { id: resourceID[i] }
      await axios.get(`${ckanGetResourceShow}`, 
        {
          params: getData,
          headers
        }
      )
      .then(getRes => {
        const resourceName = getRes.data.result.name;
        const description = getRes.data.result.description;
        const str = description.split(":");
        const publicResourceUID = str[1];
        const flag = resourceName.includes(resourceSplitName);
        if(flag){
          fail.push(resourceID[i])
        }else{
          filteredResourceID.push(resourceID[i])
          publicResourceUIDarray.push(publicResourceUID)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
    delResource();
  }
  checkSplitName();

  // 對ckan平台做post請求
  // 以filteredResourceID陣列去做刪除請求
  async function delResource(){
    for(var i = 0 ; i < filteredResourceID.length ; i++){
      const postPrivateData = { id: filteredResourceID[i] }
      const postPublicData = { id: publicResourceUIDarray[i] }

      if(publicResourceUIDarray[i]){
        axios.post(`${ckanPostResourceDelete}`, 
        postPublicData, 
          {
            headers
          }
        )
        .then(getRes => {
          success.push(publicResourceUIDarray[i]);
        })
        .catch(err => {
          console.log(err)
        })
      }

      await axios.post(`${ckanPostResourceDelete}`, 
      postPrivateData, 
        {
          headers
        }
      )
      .then(getRes => {
        success.push(filteredResourceID[i]);
      })
      .catch(err => {
        console.log(err)
        fail.push(filteredResourceID[i]);
      })
    }
    var resData = {
      success: success,
      fail: fail
    }
    var resJSONdata = JSON.stringify(resData, null, 2);
    res.status(200).send(resJSONdata);
  }
}