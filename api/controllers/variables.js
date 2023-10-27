require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

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

const ckanVariable = {
  //CKAN_BASE_URI: v6
  //CKAN_BASE_URI_2:  nycu
  CKAN_BASE_URI: process.env.CKAN_BASE_URI,
  ckanPostPackageCreate: process.env.CKAN_BASE_URI + "package_create",
  ckanPostPackagePatch: process.env.CKAN_BASE_URI + "package_patch",
  ckanGetPackageSearch: process.env.CKAN_BASE_URI + "package_search",
  //  ckanGetPackageSearchForName: process.env.CKAN_BASE_URI + "package_autocomplete",
  ckanGetPackageList: process.env.CKAN_BASE_URI + "package_list",
  ckanGetCollaboratorList: process.env.CKAN_BASE_URI + "package_collaborator_list",
  ckanGetPackageShow: process.env.CKAN_BASE_URI + "package_show",
  ckanPostCollaboratorEdit: process.env.CKAN_BASE_URI + "package_collaborator_create",
  ckanDelCollaboratorDelete: process.env.CKAN_BASE_URI + "package_collaborator_delete",
  ckanDelPackagePurge: process.env.CKAN_BASE_URI + "dataset_purge",

  ckanGetGroupList: process.env.CKAN_BASE_URI + "group_list",
  ckanGetGroupInfo: process.env.CKAN_BASE_URI + "group_show",
  ckanGetGroupPackageList: process.env.CKAN_BASE_URI + "group_package_show",
  ckanDelGroupPurge: process.env.CKAN_BASE_URI + "group_purge",

  ckanGetTagList: process.env.CKAN_BASE_URI + "tag_list",
  ckanGetTagShow: process.env.CKAN_BASE_URI + "tag_show",

  ckanGetUserInfo: process.env.CKAN_BASE_URI + "user_show",

  ckanGetOrgList: process.env.CKAN_BASE_URI + "organization_list",
  ckanGetOrgShow: process.env.CKAN_BASE_URI + "organization_show",
  ckanPostOrgMemberEdit: process.env.CKAN_BASE_URI + "organization_member_create",
  ckanPostOrgPatch: process.env.CKAN_BASE_URI + "organization_patch",
  ckanDelOrgMemberDelete: process.env.CKAN_BASE_URI + "organization_member_delete",

  ckanPostGroupMemberEdit: process.env.CKAN_BASE_URI + "group_member_create",
  ckanPostGroupCreate: process.env.CKAN_BASE_URI + "group_create",
  ckanPostGroupPatch: process.env.CKAN_BASE_URI + "group_patch",
  ckanDelGroupMemberDelete: process.env.CKAN_BASE_URI + "group_member_delete",

  ckanGetUserCollaboratorList: process.env.CKAN_BASE_URI + "package_collaborator_list_for_user",
  ckanGetUserOrgList: process.env.CKAN_BASE_URI + "organization_list_for_user",

  ckanGetResourceShow: process.env.CKAN_BASE_URI + "resource_show",
  ckanPostResourceAppend: process.env.CKAN_BASE_URI + "resource_create",
  ckanPostResourcePatch: process.env.CKAN_BASE_URI + "resource_patch",
  //  ckanPostResourceUpdate: process.env.CKAN_BASE_URI + "resource_update",
  ckanDelResourceDelete: process.env.CKAN_BASE_URI + "resource_delete",

  // params:{},URL,token,要的子層陣列
  getCommonListOrCommonPackageList:async function(reqParams, url, token, keys){
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
        // const log = err
        const resData = 
        {
          success: 500,
          data: log
        }
        return resData;
      }
    }
  },
  // 要post的資料,URL,token
  postDataFunction: async function(reqData, url, token){
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
      // console.log(log)
      resData = {
        success: 500,
        log: log
      }
    })
    return resData;
  }
}
const raccoonVariable = {
  RACCOON_BASE_URI: process.env.RACCOON_BASE_URI,
  DCMTK_TOOL_LDCM2CSV: process.env.DCMTK_TOOL_LDCM2CSV,
  DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG: process.env.DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG,
  DCMTK_TOOL_LDCM2CSV_PROFCSV: process.env.DCMTK_TOOL_LDCM2CSV_PROFCSV,

  raccoonGetQIDO: process.env.RACCOON_BASE_URI + "api/dicom/qido/studies",
  raccoonPost: process.env.RACCOON_BASE_URI + "dicom-web/studies",
  raccoonImagingStudyFHIR: process.env.RACCOON_BASE_URI + "api/fhir/ImagingStudy",
  readCSVFile:function (filePath, columns) {
    return new Promise((resolve, reject) => {
    var extractedColumns = [];
  
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Extract the desired columns from each row
        //column代表traverse的參數
        columns.forEach((column) => extractedColumns.push(row[column]));
        //console.log('extractedColumns:'+extractedColumns);
      })
      .on('end', () => {
        resolve(extractedColumns);
        //console.log('extractedColumns:'+extractedColumns);
        // console.log('CSV file processing is complete.');
      })
      .on('error', (error) => {
        reject(error);
      });
   });
  },
  // https://kiiuo.com/archives/3125/javascript-%E7%94%A2%E7%94%9F%E4%BA%82%E6%95%B8%E7%9A%84%E6%96%B9%E6%B3%95/
  // 偉大的亂數產生器
  makeid:function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
}

module.exports = {
  ckanVariable,
  raccoonVariable
};