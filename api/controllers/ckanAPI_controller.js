const path = require('path');
const fs = require('fs');
const axios = require('axios');
const seq = require('seq');
require('dotenv').config();

//CKAN_BASE_URI: v6
//CKAN_BASE_URI_2:  nycu
const {CKAN_BASE_URI} = process.env;
const ckanPostPackageCreate = CKAN_BASE_URI + "package_create";
const ckanPostPackagePatch = CKAN_BASE_URI + "package_patch";

const ckanGetPackageList = CKAN_BASE_URI + "package_list";
const ckanGetGroupList = CKAN_BASE_URI + "group_list";
const ckanGetTagList = CKAN_BASE_URI + "tag_list";
const ckanGetOrgList = CKAN_BASE_URI + "organization_list";

const ckanGetCollaboratorList = CKAN_BASE_URI + "package_collaborator_list";
const ckanGetUserCollaboratorList = CKAN_BASE_URI + "package_collaborator_list_for_user";
const ckanGetUserOrgList = CKAN_BASE_URI + "organization_list_for_user";

const ckanGetGroupInfo = CKAN_BASE_URI + "group_show";
const ckanGetGroupPackageList = CKAN_BASE_URI + "group_package_show";
const ckanGetTagShow = CKAN_BASE_URI + "tag_show";
const ckanGetOrgShow = CKAN_BASE_URI + "organization_show";
const ckanGetPackageShow = CKAN_BASE_URI + "package_show";
const ckanGetResourceShow = CKAN_BASE_URI + "resource_show";

const ckanGetPackageSearch = CKAN_BASE_URI + "package_search";
// const ckanGetPackageSearchForName = CKAN_BASE_URI + "package_autocomplete";

const ckanPostResourceAppend = CKAN_BASE_URI + "resource_create";
const ckanPostResourcePatch = CKAN_BASE_URI + "resource_patch";
// const ckanPostResourceUpdate = CKAN_BASE_URI + "resource_update";

const ckanPostCollaboratorEdit = CKAN_BASE_URI + "package_collaborator_create";
const ckanPostOrgMemberEdit = CKAN_BASE_URI + "organization_member_create";
const ckanDelOrgMemberDelete = CKAN_BASE_URI + "organization_member_delete";
const ckanDelCollaboratorDelete = CKAN_BASE_URI + "package_collaborator_delete";
const ckanDelResourceDelete = CKAN_BASE_URI + "resource_delete";

const tempDirectory = 'uploads/';
const resourceSplitName = "_[type]_"
const packageSplitName = "-type-private"
const prefixDes = 'public resource uid:'
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
      const log = err.response.data.error
      const resData = 
      {
        success: 500,
        data: log
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
      const log = err.response.data.error
      const resData = 
      {
        success: 500,
        data: log
      }
      return resData;
    }
  }
}
// 要post的資料,URL,token
async function postDataFunction(reqData, url, token){
  //包成key-value
  const headers = {"Authorization": token};
  var resData = {}
  await axios.post(url, reqData, {headers})
  .then(getRes => {
    resData = {
      success: 200
    }
  })
  .catch(err => {
    const log = err.response.data.error
    console.log(log)
    resData = {
      success: 500,
      log: log
    }
  })
  return resData;
}
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
  async function packageList(){
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(null,ckanGetPackageList,null,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
  packageList()
}
exports.getPackageShow = async (req, res) => {
  //將request的查詢參數datasetName拿出
  var searchQuery = ""
  //前端post過來的ckanToken
  var token = ""
  
  function checkReq(callback){
    try{
      if(!req.query.datasetName){
        throw "datasetName is required."
      }else{
        searchQuery = req.query.datasetName
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(packageShow)
  async function packageShow(){
    const reqParams = 
    {
      id: searchQuery
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetPackageShow,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getResourceShow = async (req, res) => {
  //將request的查詢參數id拿出
  var resourceID = ""
  //前端post過來的ckanToken
  var token = ""
  
  function checkReq(callback){
    try{
      if(!req.query.id){
        throw "id is required."
      }else{
        resourceID = req.query.id
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(resourceShow)
  async function resourceShow(){
    const reqParams = 
    {
      id: resourceID
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetResourceShow,header,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
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
  //前端post過來的ckanToken
  var token = ""
  
  function checkReq(callback){
    try{
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
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(packageSearch)
  async function packageSearch(){
    const reqParams = 
    {
      include_private: true,
      start: start,
      rows: rows,
      q:searchQuery
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetPackageSearch,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getGroupList = async (req, res) => {
  groupList()
  async function groupList(){
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(null,ckanGetGroupList,null,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getTagList = async (req, res) => {
  tagList()
  async function tagList(){
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(null,ckanGetTagList,null,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getOrgList = async (req, res) => {
  orgList()
  async function orgList(){
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(null,ckanGetOrgList,null,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getGroupPackageList = async (req, res) => {
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (group) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(groupPackageList)
  async function groupPackageList(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetGroupPackageList,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getTagPackageList = async (req, res) => {
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (tag) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(tagPackageList)
  async function tagPackageList(){
    const reqParams = {
      id: id,
      include_datasets: true
    }
    const keys = ["packages"]
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetTagShow,token,keys)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getOrgPackageList = async (req, res) => {
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (organization) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(orgPackageList)
  async function orgPackageList(){
    const reqParams = {
      id: id,
      include_datasets: true
    }
    const keys = ["packages"]
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetOrgShow,token,keys)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getGroupInfo = async (req, res) =>{
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (group) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(groupInfo)
  async function groupInfo(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetGroupInfo,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getTagInfo = async (req, res) =>{
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (tag) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(tagInfo)
  async function tagInfo(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetTagShow,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getOrgInfo = async (req, res) =>{
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (organization) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(orgInfo)
  async function orgInfo(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetOrgShow,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getCollaboratorList = async (req, res) => {
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (package) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(collaboratorList)
  async function collaboratorList(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetCollaboratorList,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getUserCollaboratorList = async (req, res) => {
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (user) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(userCollaboratorList)
  async function userCollaboratorList(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetUserCollaboratorList,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.getUserOrgList = async (req, res) => {
  var id = ""
  var token = ""
  function checkReq(callback){
    try{
      //將request的查詢參數們拿出
      if(req.query.id){
        id = req.query.id;
      }else{
        throw "id/name (user) is required."
      }
      if(req.headers.authorization){
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(userOrgList)
  async function userOrgList(){
    const reqParams = {
      id: id
    }
    // params:{},URL,token,要的子層陣列
    const resData = await getCommonListOrCommonPackageList(reqParams,ckanGetUserOrgList,token,null)
    if(resData.success == 200){
      res.status(resData.success).send(resData.data)
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
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
  var data = "";
  var header = "";

  checkRequest(packageCreate);

  function checkRequest(callback){
    try{
      //做post請求的data參數
      if(!req.body){
        throw "package infos are required.";
      }else{
        if(!req.body.name){
          throw "package name is required.";
        }else{
          const packageName = req.body.name
          if(packageName.includes(packageSplitName)){
            throw "package name is including prohibited words.";
          }
        }
        if(!req.body.title){
          throw "package title is required.";
        }
        if(!req.body.maintainer){
          throw "maintainer field is required.";
        }
        if(!req.body.maintainer_email){
          throw "maintainer_email field is required.";
        }
        if(!req.body.owner_org){
          throw "owner_org field is required.";
        }
        if(!req.body.private){
          throw "private field is required.";
        }
        data = req.body;
      }
      //前端post過來的ckanToken
      if(!req.headers.authorization){
        throw "token is required.";
      }else{
        header = req.headers.authorization;
      }
      callback();
    }catch(e){
      res.status(500).send(e)
    }
  }
  async function packageCreate(){
    // 對ckan平台做post請求
    // private
    var privateData = JSON.parse(JSON.stringify(data));
    privateData.name = privateData.name + packageSplitName
    privateData.private = true
    // 要post的資料,URL,token
    const privateRes = await postDataFunction(privateData, ckanPostPackageCreate, header)
    // public
    // 要post的資料,URL,token
    const publicRes = await postDataFunction(data, ckanPostPackageCreate, header)

    const response = {
      status:{
        private:privateRes,
        public:publicRes
      }
    }
    res.status(200).send(response)
  }
}
exports.postPackagePatch = async (req, res) => {
  var data = "";
  var header = "";

  checkRequest(packagePatch);

  // 先檢查req各種欄位
  function checkRequest(callback){
    try{
      //做post請求的data參數
      if(!req.body){
        throw "package infos are required.";
      }else{
        if(!req.body.id){
          throw "package name/id is required.";
        }else{
          const privatePakcageName = req.body.id;
          // 檢查傳過來的package_name是不是私有資料集的name
          if(!privatePakcageName.includes(packageSplitName)){
            throw "package name does not inlcude the field of private dataset.";
          }
        }
        if(req.body.private){
          throw "private field is prohibited here.";
        }
        if(req.body.state){
          throw "state field is prohibited here.";
        }
        data = req.body;
      }
      //前端post過來的ckanToken
      if(!req.headers.authorization){
        throw "token is required.";
      }else{
        header = req.headers.authorization;
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(500).send(e)
    }
  }
  async function packagePatch(){
    // private
    // 要post的資料,URL,token
    const privateRes = await postDataFunction(data, ckanPostPackagePatch, header)
    
    // public
    var publicData = JSON.parse(JSON.stringify(data));
    const publicPackageName = publicData.id;
    publicData.id = publicPackageName.split(packageSplitName);
    publicData.id = publicData.id[0];
    // 要post的資料,URL,token
    const publicRes = await postDataFunction(publicData, ckanPostPackagePatch, header)
    
    const response = {
      status:{
        private:privateRes,
        public:publicRes
      }
    }
    res.status(200).send(response)
  }
}
exports.postResourceCreate = async (req, res) => {
  // 做post請求的data參數
  var privatePackageID = "";
  var publicPackageID = "";
  // 附件的檔名
  var resourceName = "";
  // 前端post過來的ckanToken包成key-value
  var headers = "";
  checkReq(checkPackageStatus);
  function checkReq(callback){
    try{
      // 檢查資料集id是否包含私有格式
      if(req.body.package_id){
        const packageID = req.body.package_id;
        if(packageID.includes(packageSplitName)){
          privatePackageID = req.body.package_id;
          const str = privatePackageID.split(packageSplitName)
          publicPackageID = str[0];
        }else{
          throw "package_id doesn't include the private dataset format."
        }
      // 沒有id就噴err
      }else{
        throw "package_id is required."
      }

      // 檢查檔名是否包含索引檔字元
      if(req.body.resourceName){
        resourceName = req.body.resourceName;
        if(resourceName.includes(resourceSplitName)){
          throw resourceName + " contains prohibited words."
        }
      }else{
        throw "resourceName is required."
      }

      // 檢查是否帶token
      if(req.headers.authorization){
        const header = req.headers.authorization; 
        //包成key-value
        headers = 
        {
          Authorization: header,
          "Content-Type": "multipart/form-data"
        };
      }else{
        throw "token is required."
      }

      // 檢查是否上傳檔案
      if(!req.file){
        throw "no resourceFile uploaded.";
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }

  var publicFlag = true;
  async function checkPackageStatus(){
    var callbackFlag = false
    await axios.get(`${ckanGetPackageShow}`,
      {
        params: { id: privatePackageID },
        headers
      }
    )
    .then(getRes => {
      console.log("private dataset exist.");
      callbackFlag = true
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
    if(callbackFlag){
      resourcesUpload();
    }
  }
  
  // traverse每項上傳的檔案
  async function resourcesUpload(){
    try {
      // req.files.path 上傳後的臨時路徑
      // req.files.originalname 原本的檔名
      const resourceFile = req.file;
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
        throw errLog
      }else{
        res.status(200).send()
      }
    } catch (err) {
      //ckan返回請求錯誤的訊息
      console.log(err);
      res.status(500).send(err);
    }
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
exports.getFilteredPackageList = async (req, res) => {
  var response = []
  var header = "";
  if(req.headers.authorization){
    header = req.headers.authorization;
  }

  //主線佇列
  seq()
  .seq(function(){
    var seq_this = this;
    step1(function() {seq_this();});
  })
  .seq(function(){
    var seq_this = this;
    step2(function() {seq_this();});
  })

  var searchFlag = false
  var conditions = [];

  async function step1(callback){
    if(req.body.package_search){
      searchFlag = true
      const searchQuery = req.body.package_search.searchQuery;
      const begin = req.body.package_search.begin;
      const limit = req.body.package_search.limit;
      const reqParams = 
      {
        q: searchQuery,
        start: begin,
        rows: limit
      }
      const condition = {
        package_search: reqParams
      }
      conditions.push(condition)
      const keys = ["results"]
      const result = await getCommonListOrCommonPackageList(reqParams,ckanGetPackageSearch,header,keys);
      // params:{},URL,token,要的子層陣列
      const packageResults = result.data;
      var packageArray = []
      packageResults.forEach(dataset => {
        packageArray.push(dataset.id);
      })
      response.push(packageArray)
    }
    if(req.body.group_package_list){
      searchFlag = true
      const id = req.body.group_package_list.id;
      const reqParams = 
      {
        id: id
      }
      const condition = {
        group_package_list: reqParams
      }
      conditions.push(condition)
      const result = await getCommonListOrCommonPackageList(reqParams,ckanGetGroupPackageList,header,null)
      const packageResults = result.data;
      var packageArray = []
      packageResults.forEach(dataset => {
        packageArray.push(dataset.id);
      })
      response.push(packageArray)
    }
    if(req.body.tag_package_list){
      searchFlag = true
      const id = req.body.tag_package_list.id;
      const reqParams = 
      {
        id: id,
        include_datasets: true
      }
      const condition = {
        tag_package_list: id
      }
      conditions.push(condition)
      const keys = ["packages"]
      const result = await getCommonListOrCommonPackageList(reqParams,ckanGetTagShow,header,keys)
      const packageResults = result.data;
      var packageArray = []
      packageResults.forEach(dataset => {
        packageArray.push(dataset.id);
      })
      response.push(packageArray)
    }
    if(req.body.organization_package_list){
      searchFlag = true
      const id = req.body.organization_package_list.id;
      const reqParams = 
      {
        id: id,
        include_datasets: true
      }
      const condition = {
        organization_package_list: id
      }
      conditions.push(condition)
      const keys = ["packages"]
      const result = await getCommonListOrCommonPackageList(reqParams,ckanGetOrgShow,header,keys)
      const packageResults = result.data;
      var packageArray = []
      packageResults.forEach(dataset => {
        packageArray.push(dataset.id);
      })
      response.push(packageArray)
    }
    callback();
  }
  function step2(callback){
    try{
      if(searchFlag){
        // 以第0陣列為基準
        const result = response[0].filter(element => {
          // 使用every方法檢查id是否在其他子陣列存在
          return response.slice(1).every(subArray => subArray.includes(element));
        });
        const resData = 
        {
          success: 200,
          conditions: conditions,
          data: result
        }
        const resJSONdata = JSON.stringify(resData, null, 2);
        res.status(200).send(resJSONdata);
      }else{
        throw "At least one filter condition is required."
      }
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
    callback();
  }
}
exports.postCollaboratorEdit = async (req, res) => {
  var packageID = ""
  var userID = ""
  var role = ""
  var token = ""
  
  function checkReq(callback){
    try{
      if(!req.body){
        throw "the body is required."
      }else{
        if(!req.body.id){
          throw "the id(package) is required.";
        }else{
          packageID = req.body.id
        }
        if(!req.body.userID){
          throw "the userID is required.";
        }else{
          userID = req.body.userID
        }
        if(!req.body.role){
          throw "the role is required.";
        }else{
          role = req.body.role
        }
      }
      if(!req.headers.authorization){
        throw "the token is required.";
      }else{
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(collaborateEdit)
  async function collaborateEdit(){
    const reqData = {
      id: packageID,
      user_id: userID,
      capacity: role
    }
    const resData = await postDataFunction(reqData,ckanPostCollaboratorEdit,token)
    if(resData.success == 200){
      res.status(resData.success).send()
    }else if(resData.success == 500){
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.postOrgMemberEdit = async (req, res) => {  
  var orgID = ""
  var userID = ""
  var role = ""
  var token = ""
  
  function checkReq(callback){
    try{
      if(!req.body){
        throw "the body is required."
      }else{
        if(!req.body.id){
          throw "the id(organization) is required.";
        }else{
          orgID = req.body.id
        }
        if(!req.body.userID){
          throw "the userID is required.";
        }else{
          userID = req.body.userID
        }
        if(!req.body.role){
          throw "the role is required.";
        }else{
          role = req.body.role
        }
      }
      if(!req.headers.authorization){
        throw "the token is required.";
      }else{
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(orgMemberEdit)
  async function orgMemberEdit(){
    const reqData = {
      id: orgID,
      username: userID,
      role: role
    }
    const resData = await postDataFunction(reqData,ckanPostOrgMemberEdit,token)
    if(resData.success == 200){
      res.status(resData.success).send()
    }else if(resData.success == 500){
      console.log(resData)
      res.status(resData.success).send(resData.log)
    }
  }
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
  async function checkSplitName(callback){
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
    callback();
  }
  // 對ckan平台做post請求
  // 以filteredResourceID陣列去做刪除請求
  async function delResource(){
    for(var i = 0 ; i < filteredResourceID.length ; i++){
      const postPrivateData = { id: filteredResourceID[i] }
      const postPublicData = { id: publicResourceUIDarray[i] }

      if(publicResourceUIDarray[i]){
        axios.post(`${ckanDelResourceDelete}`, 
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

      await axios.post(`${ckanDelResourceDelete}`, 
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
  checkSplitName(delResource);
}
exports.delCollaboratorDelete = async (req, res) => {  
  var packageID = ""
  var userID = ""
  var token = ""
  
  function checkReq(callback){
    try{
      if(!req.body){
        throw "the body is required."
      }else{
        if(!req.body.id){
          throw "the id(organization) is required.";
        }else{
          packageID = req.body.id
        }
        if(!req.body.userID){
          throw "the userID is required.";
        }else{
          userID = req.body.userID
        }
      }
      if(!req.headers.authorization){
        throw "the token is required.";
      }else{
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(collaboratorDelete)
  async function collaboratorDelete(){
    const reqData = {
      id: packageID,
      user_id: userID
    }
    const resData = await postDataFunction(reqData,ckanDelCollaboratorDelete,token)
    if(resData.success == 200){
      res.status(resData.success).send()
    }else if(resData.success == 500){
      res.status(resData.success).send(resData.log)
    }
  }
}
exports.delOrgMemberDelete = async (req, res) => {  
  var orgID = ""
  var userID = ""
  var token = ""
  
  function checkReq(callback){
    try{
      if(!req.body){
        throw "the body is required."
      }else{
        if(!req.body.id){
          throw "the id(organization) is required.";
        }else{
          orgID = req.body.id
        }
        if(!req.body.userID){
          throw "the userID is required.";
        }else{
          userID = req.body.userID
        }
      }
      if(!req.headers.authorization){
        throw "the token is required.";
      }else{
        token = req.headers.authorization
      }
      callback();
    }catch(e){
      console.log(e)
      res.status(403).send(e)
    }
  }
  checkReq(orgMemberDelete)
  async function orgMemberDelete(){
    const reqData = {
      id: orgID,
      username: userID
    }
    const resData = await postDataFunction(reqData,ckanDelOrgMemberDelete,token)
    if(resData.success == 200){
      res.status(resData.success).send()
    }else if(resData.success == 500){
      res.status(resData.success).send(resData.log)
    }
  }
}