const path = require("path");
const fs = require("fs");
const axios = require("axios");
const seq = require("seq");
const { ckanVariable } = require("./variables.js");

const tempDirectory = "uploads/";
const resourceSplitName = "_[type]_";
const packageSplitName = "-type-private";
const prefixDes = "public resource uid:";
const axiosErrMes = {
  success: false,
  possible_reason: ["sent wrong id", "can't connect to ckan"],
};
const axiosErrMesJSON = JSON.stringify(axiosErrMes, null, 2);

// get
exports.checkGet = async (req, res) => {
  try {
    console.log("ckan get api working well.");
    res.send("ckan get api working well.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from external API");
  }
};
exports.getPackageList = async (req, res) => {
  async function packageList() {
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      null,
      ckanVariable.ckanGetPackageList,
      null,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
  packageList();
};
exports.getPackageShow = async (req, res) => {
  //將request的查詢參數datasetName拿出
  var searchQuery = "";
  //前端post過來的ckanToken
  var token = "";

  function checkReq(callback) {
    try {
      if (!req.query.datasetName) {
        throw "datasetName is required.";
      } else {
        searchQuery = req.query.datasetName;
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(packageShow);
  async function packageShow() {
    const reqParams = {
      id: searchQuery,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetPackageShow,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getUserInfo = async (req, res) => {
  //將request的查詢參數id拿出
  var searchQuery = "";
  //前端post過來的ckanToken
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      userShow(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.query.id) {
        throw "id/username is required.";
      } else {
        searchQuery = req.query.id;
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  async function userShow() {
    const reqParams = {
      id: searchQuery,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetUserInfo,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getResourceShow = async (req, res) => {
  //將request的查詢參數id拿出
  var resourceID = "";
  //前端post過來的ckanToken
  var token = "";

  function checkReq(callback) {
    try {
      if (!req.query.id) {
        throw "id is required.";
      } else {
        resourceID = req.query.id;
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(resourceShow);
  async function resourceShow() {
    const reqParams = {
      id: resourceID,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetResourceShow,
      header,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
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
  var token = "";

  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.searchQuery) {
        searchQuery = req.query.searchQuery;
      }
      if (req.query.begin) {
        start = req.query.begin;
      }
      if (req.query.limit) {
        rows = req.query.limit;
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(packageSearch);
  async function packageSearch() {
    const reqParams = {
      include_private: true,
      start: start,
      rows: rows,
      q: searchQuery,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetPackageSearch,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getGroupList = async (req, res) => {
  var id = "";
  checkReq();
  function checkReq() {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
        getOrgGroupList();
      } else {
        getAllGroupList();
      }
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }

  var groupsList = [];
  async function getOrgGroupList() {
    const reqParams = {
      id: id,
    };
    const keys = ["groups"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetOrgShow,
      null,
      keys
    );
    const orgGroups = resData.data;
    groupsList = orgGroups.map((item) => item.name);
    resData.data = groupsList;
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }

  async function getAllGroupList() {
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      null,
      ckanVariable.ckanGetGroupList,
      null,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getTagList = async (req, res) => {
  tagList();
  async function tagList() {
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      null,
      ckanVariable.ckanGetTagList,
      null,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getOrgList = async (req, res) => {
  orgList();
  async function orgList() {
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      null,
      ckanVariable.ckanGetOrgList,
      null,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getGroupPackageList = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (group) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(groupPackageList);
  async function groupPackageList() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetGroupPackageList,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getTagPackageList = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (tag) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(tagPackageList);
  async function tagPackageList() {
    const reqParams = {
      id: id,
      include_datasets: true,
    };
    const keys = ["packages"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetTagShow,
      token,
      keys
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getOrgPackageList = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (organization) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(orgPackageList);
  async function orgPackageList() {
    const reqParams = {
      id: id,
      include_datasets: true,
    };
    const keys = ["packages"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetOrgShow,
      token,
      keys
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getGroupInfo = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (group) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(groupInfo);
  async function groupInfo() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetGroupInfo,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getTagInfo = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (tag) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(tagInfo);
  async function tagInfo() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetTagShow,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getOrgInfo = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (organization) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(orgInfo);
  async function orgInfo() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetOrgShow,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getCollaboratorList = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (package) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(collaboratorList);
  async function collaboratorList() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetCollaboratorList,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getUserCollaboratorList = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (user) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(userCollaboratorList);
  async function userCollaboratorList() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetUserCollaboratorList,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.getUserOrgList = async (req, res) => {
  var id = "";
  var token = "";
  function checkReq(callback) {
    try {
      //將request的查詢參數們拿出
      if (req.query.id) {
        id = req.query.id;
      } else {
        throw "id/name (user) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(userOrgList);
  async function userOrgList() {
    const reqParams = {
      id: id,
    };
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetUserOrgList,
      token,
      null
    );
    if (resData.success == 200) {
      res.status(resData.success).send(resData.data);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};

exports.getPackageGroupList = async (req, res) => {
  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      getGroupListOfPackage(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  var packageID = "";
  var token = "";
  async function checkReq(callback) {
    try {
      if (req.query.id) {
        packageID = req.query.id;
      } else {
        throw "the id(package) is required.";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      } else {
        throw "the token(package) is required.";
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }

  var result = "";
  async function getGroupListOfPackage(callback) {
    const reqParams = {
      id: packageID,
    };
    const keys = ["groups"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetPackageShow,
      token,
      keys
    );
    result = resData.data.map((item) => item.name);
    callback();
  }
  async function sendRes() {
    res.status(200).send(result);
  }
};

// post
exports.checkPost = async (req, res) => {
  try {
    console.log("ckan post api working well.");
    res.send("ckan post api working well.");
  } catch (error) {
    console.error(error.response.data.error);
    res.status(500).send("Error fetching data from external API");
    return;
  }
};
exports.postPackageCreate = async (req, res) => {
  var data = "";
  var header = "";

  checkRequest(packageCreate);

  async function checkRequest(callback) {
    try {
      //做post請求的data參數
      if (!req.body) {
        throw "package infos are required.";
      } else {
        if (!req.body.name) {
          throw "package name is required.";
        } else {
          const packageName = req.body.name;
          if (packageName.includes(packageSplitName)) {
            throw "package name is including prohibited words.";
          }
        }
        if (!req.body.title) {
          throw "package title is required.";
        }
        if (!req.body.maintainer) {
          throw "maintainer field is required.";
        }
        if (!req.body.maintainer_email) {
          throw "maintainer_email field is required.";
        }
        if (!req.body.owner_org) {
          throw "owner_org field is required.";
        }
        if (!req.body.group) {
          throw "group field is required.";
        }
        data = req.body;
        data["private"] = false;
        data["extras"] = [{ key: "needapply", value: "true" }];
        const group = req.body.group;
        data["groups"] = [{ name: group }];
      }
      //前端post過來的ckanToken
      if (!req.headers.authorization) {
        throw "token is required.";
      } else {
        header = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
  async function packageCreate() {
    var publicRes = {};
    var privateRes = {};
    // 對ckan平台做post請求
    // private
    var privateData = JSON.parse(JSON.stringify(data));
    privateData.name = privateData.name + packageSplitName;
    privateData.private = true;
    delete privateData.extras;
    // 要post的資料,URL,token
    privateRes = await ckanVariable.postDataFunction(
      privateData,
      ckanVariable.ckanPostPackageCreate,
      header
    );
    try {
      // public
      // 要post的資料,URL,token
      if (privateRes.success == 200) {
        publicRes = await ckanVariable.postDataFunction(
          data,
          ckanVariable.ckanPostPackageCreate,
          header
        );
        if (publicRes.success == 200) {
          const response = {
            status: {
              private: privateRes,
              public: publicRes,
            },
          };
          res.status(200).send(response);
        } else {
          throw "this dataset name is used by others.";
        }
      } else {
        throw "this dataset name is used by others.";
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
};
exports.postPackagePatch = async (req, res) => {
  var data = "";
  var header = "";

  checkRequest(packagePatch);

  // 先檢查req各種欄位
  function checkRequest(callback) {
    try {
      //做post請求的data參數
      if (!req.body) {
        throw "package infos are required.";
      } else {
        if (!req.body.id) {
          throw "package name/id is required.";
        } else {
          const privatePakcageName = req.body.id;
          // 檢查傳過來的package_name是不是私有資料集的name
          if (!privatePakcageName.includes(packageSplitName)) {
            throw "package name does not inlcude the field of private dataset.";
          }
        }
        if (req.body.private) {
          throw "private field is prohibited here.";
        }
        if (req.body.state) {
          throw "state field is prohibited here.";
        }
        data = req.body;
      }
      //前端post過來的ckanToken
      if (!req.headers.authorization) {
        throw "token is required.";
      } else {
        header = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
  async function packagePatch() {
    // private
    // 要post的資料,URL,token
    const privateRes = await ckanVariable.postDataFunction(
      data,
      ckanVariable.ckanPostPackagePatch,
      header
    );

    // public
    var publicData = JSON.parse(JSON.stringify(data));
    const publicPackageName = publicData.id;
    publicData.id = publicPackageName.split(packageSplitName);
    publicData.id = publicData.id[0];
    // 要post的資料,URL,token
    const publicRes = await ckanVariable.postDataFunction(
      publicData,
      ckanVariable.ckanPostPackagePatch,
      header
    );

    const response = {
      status: {
        private: privateRes,
        public: publicRes,
      },
    };
    res.status(200).send(response);
  }
};
exports.postResourceCreate = async (req, res) => {
  // 做post請求的data參數
  var privatePackageID = "";
  var publicPackageID = "";
  // 附件的檔名
  var resourceName = "";
  // 前端post過來的ckanToken包成key-value
  var headers = "";
  checkReq(checkPackageStatus);
  function checkReq(callback) {
    try {
      // 檢查資料集id是否包含私有格式
      if (req.body.package_id) {
        const packageID = req.body.package_id;
        if (packageID.includes(packageSplitName)) {
          privatePackageID = req.body.package_id;
          const str = privatePackageID.split(packageSplitName);
          publicPackageID = str[0];
        } else {
          throw "package_id doesn't include the private dataset format.";
        }
        // 沒有id就噴err
      } else {
        throw "package_id is required.";
      }

      // 檢查檔名是否包含索引檔字元
      if (req.body.resourceName) {
        resourceName = req.body.resourceName;
        if (resourceName.includes(resourceSplitName)) {
          throw resourceName + " contains prohibited words.";
        }
      } else {
        throw "resourceName is required.";
      }

      // 檢查是否帶token
      if (req.headers.authorization) {
        const header = req.headers.authorization;
        //包成key-value
        headers = {
          Authorization: header,
          "Content-Type": "multipart/form-data",
        };
      } else {
        throw "token is required.";
      }

      // 檢查是否上傳檔案
      if (!req.file) {
        throw "no resourceFile uploaded.";
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }

  var publicFlag = true;
  async function checkPackageStatus() {
    var callbackFlag = false;
    await axios
      .get(`${ckanVariable.ckanGetPackageShow}`, {
        params: { id: privatePackageID },
        headers,
      })
      .then((getRes) => {
        console.log("private dataset exist.");
        callbackFlag = true;
      })
      .catch((err) => {
        res.status(500).send("private dataset doesn't exist");
      });

    await axios
      .get(`${ckanVariable.ckanGetPackageShow}`, {
        params: { id: publicPackageID },
        headers,
      })
      .then((getRes) => {
        console.log("public dataset exist.");
        publicFlag = true;
      })
      .catch((err) => {
        console.log("public dataset doesn't exist");
        publicFlag = false;
      });
    if (callbackFlag) {
      resourcesUpload();
    }
  }

  // traverse每項上傳的檔案
  async function resourcesUpload() {
    try {
      // req.files.path 上傳後的臨時路徑
      // req.files.originalname 原本的檔名
      const resourceFile = req.file;
      //宣告formdata物件
      const privateFormData = new FormData();
      const publicFormData = new FormData();
      // 將檔案轉成blob屬性
      const resourceContent = fs.readFileSync(resourceFile.path);
      const blob = new Blob([resourceContent], { type: resourceFile.mimetype });
      privateFormData.append("upload", blob, resourceName);
      publicFormData.append("upload", blob, resourceName);
      // 砍檔案
      fs.unlink(resourceFile.path, (error) => {
        if (error) {
          throw "remove temporary resourceFile failed.";
        }
      });
      // package_id is required
      privateFormData.append("package_id", privatePackageID);
      publicFormData.append("package_id", publicPackageID);
      privateFormData.append("name", resourceName);
      publicFormData.append("name", resourceName);
      const parts = resourceName.split(".");
      const format = parts[parts.length - 1];
      privateFormData.append("format", format);
      publicFormData.append("format", format);

      var errLog = [];
      var publicResourceUID = "";
      if (publicFlag) {
        // 對ckan平台做post請求(公有資料集)
        await axios
          .post(`${ckanVariable.ckanPostResourceAppend}`, publicFormData, {
            headers,
          })
          .then((getRes) => {
            publicResourceUID = getRes.data.result.id;
            const completeDes = prefixDes + publicResourceUID;
            privateFormData.append("description", completeDes);
          })
          .catch((err) => {
            console.log("err=" + err);
            errLog.push(err);
          });
      } else {
        privateFormData.append("description", prefixDes);
      }
      // 對ckan平台做post請求(私有資料集)
      await axios
        .post(`${ckanVariable.ckanPostResourceAppend}`, privateFormData, {
          headers,
        })
        .catch((err) => {
          console.log("err=" + err);
          errLog.push(err);
        });
      if (errLog.length > 0) {
        throw errLog;
      } else {
        res.status(200).send();
      }
    } catch (err) {
      //ckan返回請求錯誤的訊息
      console.log(err);
      res.status(500).send(err);
    }
  }
};
exports.postIndexCreate = async (req, res) => {
  //做post請求的data參數
  var packageID = "";
  var symptoms = [];
  var existSymptoms = [];
  //前端post過來的ckanToken
  var header = "";
  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      indexCreate(function () {
        seq_this();
      });
    });

  async function checkReq(callback) {
    try {
      if (req.body.package_id) {
        const flag = req.body.package_id.includes(packageSplitName);
        if (flag) {
          packageID = req.body.package_id;
        } else {
          throw "package_id doesn't include the essential private characters.";
        }
      } else {
        throw "package_id is required.";
      }
      if (req.body.symptoms) {
        const tmpSymptoms = req.body.symptoms;
        const reqParams = {
          id: req.body.package_id,
        };
        const token = req.headers.authorization;
        const keys = ["resources"];
        // params:{},URL,token,要的子層陣列
        const resData = await ckanVariable.getCommonListOrCommonPackageList(
          reqParams,
          ckanVariable.ckanGetPackageShow,
          token,
          keys
        );
        const results = resData.data;
        const packageResourcesList = results.map((item) => item.name);
        const appendSymptomsFiltered = tmpSymptoms.filter(
          (symptom) =>
            !packageResourcesList.some((resource) => resource === symptom)
        );
        existSymptoms = tmpSymptoms.filter((symptom) =>
          packageResourcesList.some((resource) => resource === symptom)
        );
        symptoms = appendSymptomsFiltered;
        if (symptoms.length == 0) {
          throw "all symptoms were included by dataset.";
        }
      } else {
        throw "symptom(type:array) is required.";
      }
      if (req.headers.authorization) {
        header = req.headers.authorization;
      } else {
        throw "token is required.";
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  //包成key-value
  // const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
  async function indexCreate() {
    var count = 0;
    for (let i = 0; i < symptoms.length; i++) {
      //宣告formdata物件
      const formData = new FormData();
      formData.append("package_id", packageID);
      const str = packageID.split(packageSplitName);
      const public = str[0];
      const indexName = public + resourceSplitName + symptoms[i];
      formData.append("name", indexName);

      // 要post的資料,URL,token
      const resData = await ckanVariable.postDataFunction(
        formData,
        ckanVariable.ckanPostResourceAppend,
        header
      );
      if (resData.success == 200) {
        count++;
      }
    }
    if (count == symptoms.length) {
      const response = {
        append: symptoms,
        exist: existSymptoms,
      };
      res.status(200).send(response);
    } else {
      const response = {
        append: symptoms,
        exist: existSymptoms,
      };
      res.status(500).send(response);
    }
  }
};
exports.getFilteredPackageList = async (req, res) => {
  var response = [];
  var header = "";
  if (req.headers.authorization) {
    header = req.headers.authorization;
  }

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      step1(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      step2(function () {
        seq_this();
      });
    });

  var searchFlag = false;
  var conditions = [];

  async function step1(callback) {
    if (req.body.package_search) {
      searchFlag = true;
      const searchQuery = req.body.package_search.searchQuery;
      const begin = req.body.package_search.begin;
      const limit = req.body.package_search.limit;
      const reqParams = {
        q: searchQuery,
        start: begin,
        rows: limit,
      };
      const condition = {
        package_search: reqParams,
      };
      conditions.push(condition);
      const keys = ["results"];
      const result = await ckanVariable.getCommonListOrCommonPackageList(
        reqParams,
        ckanVariable.ckanGetPackageSearch,
        header,
        keys
      );
      // params:{},URL,token,要的子層陣列
      const packageResults = result.data;
      var packageArray = [];
      packageResults.forEach((dataset) => {
        packageArray.push(dataset.id);
      });
      response.push(packageArray);
    }
    if (req.body.group_package_list) {
      searchFlag = true;
      const id = req.body.group_package_list.id;
      const reqParams = {
        id: id,
      };
      const condition = {
        group_package_list: reqParams,
      };
      conditions.push(condition);
      const result = await ckanVariable.getCommonListOrCommonPackageList(
        reqParams,
        ckanVariable.ckanGetGroupPackageList,
        header,
        null
      );
      const packageResults = result.data;
      var packageArray = [];
      packageResults.forEach((dataset) => {
        packageArray.push(dataset.id);
      });
      response.push(packageArray);
    }
    if (req.body.tag_package_list) {
      searchFlag = true;
      const id = req.body.tag_package_list.id;
      const reqParams = {
        id: id,
        include_datasets: true,
      };
      const condition = {
        tag_package_list: id,
      };
      conditions.push(condition);
      const keys = ["packages"];
      const result = await ckanVariable.getCommonListOrCommonPackageList(
        reqParams,
        ckanVariable.ckanGetTagShow,
        header,
        keys
      );
      const packageResults = result.data;
      var packageArray = [];
      packageResults.forEach((dataset) => {
        packageArray.push(dataset.id);
      });
      response.push(packageArray);
    }
    if (req.body.organization_package_list) {
      searchFlag = true;
      const id = req.body.organization_package_list.id;
      const reqParams = {
        id: id,
        include_datasets: true,
      };
      const condition = {
        organization_package_list: id,
      };
      conditions.push(condition);
      const keys = ["packages"];
      const result = await ckanVariable.getCommonListOrCommonPackageList(
        reqParams,
        ckanVariable.ckanGetOrgShow,
        header,
        keys
      );
      const packageResults = result.data;
      var packageArray = [];
      packageResults.forEach((dataset) => {
        packageArray.push(dataset.id);
      });
      response.push(packageArray);
    }
    callback();
  }
  function step2(callback) {
    try {
      if (searchFlag) {
        // 以第0陣列為基準
        const result = response[0].filter((element) => {
          // 使用every方法檢查id是否在其他子陣列存在
          return response
            .slice(1)
            .every((subArray) => subArray.includes(element));
        });
        const resData = {
          success: 200,
          conditions: conditions,
          data: result,
        };
        const resJSONdata = JSON.stringify(resData, null, 2);
        res.status(200).send(resJSONdata);
      } else {
        throw "At least one filter condition is required.";
      }
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
    callback();
  }
};
exports.postCollaboratorEdit = async (req, res) => {
  var packageID = "";
  var users = "";
  var role = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      collaborateEdit(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(package) is required.";
        } else {
          const flag = req.body.id.includes(packageSplitName);
          if (flag) {
            packageID = req.body.id;
          } else {
            throw "id(package) doesn't include the private dataset format.";
          }
        }
        if (!req.body.users) {
          throw "the users is required.";
        } else {
          users = req.body.users;
        }
        if (!req.body.role) {
          throw "the role is required.";
        } else {
          role = req.body.role;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  var privateSuccess = [];
  var privateFail = [];
  var publicSuccess = [];
  var publicFail = [];
  async function collaborateEdit(callback) {
    for (let i = 0; i < users.length; i++) {
      // private
      const privateReqData = {
        id: packageID,
        user_id: users[i],
        capacity: role,
      };
      const privateResData = await ckanVariable.postDataFunction(
        privateReqData,
        ckanVariable.ckanPostCollaboratorEdit,
        token
      );
      if (privateResData.success == 200) {
        privateSuccess.push(users[i]);
      } else if (privateResData.success == 500) {
        const error = {
          user: users[i],
          error_log: privateResData.log,
        };
        privateFail.push(error);
      }
      // public
      const publicPackageID = packageID.slice(0, -packageSplitName.length);
      const publicReqData = {
        id: publicPackageID,
        user_id: users[i],
        capacity: role,
      };
      const publicResData = await ckanVariable.postDataFunction(
        publicReqData,
        ckanVariable.ckanPostCollaboratorEdit,
        token
      );
      if (publicResData.success == 200) {
        publicSuccess.push(users[i]);
      } else if (publicResData.success == 500) {
        const error = {
          user: users[i],
          error_log: publicResData.log,
        };
        publicFail.push(error);
      }
      if (i == users.length - 1) {
        callback();
      }
    }
  }
  function sendRes() {
    const response = {
      public: {
        success: publicSuccess,
        fail: publicFail,
      },
      private: {
        success: privateSuccess,
        fail: privateFail,
      },
    };
    res.status(200).send(response);
  }
};
exports.postOrgMemberEdit = async (req, res) => {
  var orgID = "";
  var users = "";
  var role = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      orgMemberEdit(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(organization)) is required.";
        } else {
          orgID = req.body.id;
        }
        if (!req.body.users) {
          throw "the users is required.";
        } else {
          users = req.body.users;
        }
        if (!req.body.role) {
          throw "the role is required.";
        } else {
          role = req.body.role;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  var success = [];
  var fail = [];
  async function orgMemberEdit(callback) {
    for (let i = 0; i < users.length; i++) {
      const reqData = {
        id: orgID,
        username: users[i],
        role: role,
      };
      const resData = await ckanVariable.postDataFunction(
        reqData,
        ckanVariable.ckanPostOrgMemberEdit,
        token
      );
      if (resData.success == 200) {
        success.push(users[i]);
      } else if (resData.success == 500) {
        const error = {
          user: users[i],
          error_log: resData.log,
        };
        fail.push(error);
      }
      if (i == users.length - 1) {
        callback();
      }
    }
  }
  function sendRes() {
    const response = {
      success: success,
      fail: fail,
    };
    res.status(200).send(response);
  }
};
exports.postGroupMemberEdit = async (req, res) => {
  var groupID = "";
  var users = "";
  var role = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      groupMemberEdit(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(group) is required.";
        } else {
          groupID = req.body.id;
        }
        if (!req.body.users) {
          throw "the users is required.";
        } else {
          users = req.body.users;
        }
        if (!req.body.role) {
          throw "the role is required.";
        } else {
          role = req.body.role;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  var success = [];
  var fail = [];
  async function groupMemberEdit(callback) {
    for (let i = 0; i < users.length; i++) {
      const reqData = {
        id: groupID,
        username: users[i],
        role: role,
      };
      const resData = await ckanVariable.postDataFunction(
        reqData,
        ckanVariable.ckanPostGroupMemberEdit,
        token
      );
      if (resData.success == 200) {
        success.push(users[i]);
      } else if (resData.success == 500) {
        const error = {
          user: users[i],
          error_log: resData.log,
        };
        fail.push(error);
      }
      if (i == users.length - 1) {
        callback();
      }
    }
  }
  function sendRes() {
    const response = {
      success: success,
      fail: fail,
    };
    res.status(200).send(response);
  }
};
exports.postOrgGroupAppend = async (req, res) => {
  var name = "";
  var org = "";
  var title = "";
  var token = "";
  var existFlag = false;

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      groupExistCheck(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      groupCreateOrCheckOrg(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      appendOrgGroups(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      groupOrgAppend(function () {
        seq_this();
      });
    });

  async function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.name) {
          throw "the name(group) is required.";
        } else {
          name = req.body.name;
        }
        if (!req.body.owner_org) {
          throw "the owner_org is required.";
        } else {
          const params = {
            id: req.body.owner_org,
          };
          const resData = await ckanVariable.getCommonListOrCommonPackageList(
            params,
            ckanVariable.ckanGetGroupInfo,
            null,
            null
          );
          if (resData.success == 200) {
            org = req.body.owner_org;
          } else {
            throw "organization not found.";
          }
        }
        if (req.body.title) {
          title = req.body.title;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  async function groupExistCheck(callback) {
    const params = {
      id: name,
    };
    const keys = ["state"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      params,
      ckanVariable.ckanGetGroupInfo,
      null,
      null
    );
    if (resData.success == 200) {
      existFlag = true;
    } else if (resData.success == 500) {
      existFlag = false;
    }
    callback();
  }

  async function groupCreateOrCheckOrg(callback) {
    // 對象為不存在群組的話，創建群組
    if (existFlag == false) {
      try {
        if (!title) {
          throw "the title(group) is required.";
        }
        const extras = [{ key: "owner_org", value: org }];
        const reqData = {
          name: name,
          title: title,
          extras: extras,
        };
        const resData = await ckanVariable.postDataFunction(
          reqData,
          ckanVariable.ckanPostGroupCreate,
          token
        );
        if (resData.success == 200) {
          console.log("continue");
          callback();
        } else if (resData.success == 500) {
          console.log(resData);
          res.status(resData.success).send(resData.log);
        }
      } catch (e) {
        console.log(e);
        res.status(403).send(e);
      }
      // 對象是既存群組的話，改檢查該群組的owner_org是否擁有組織
    } else {
      const params = {
        id: name,
      };
      const keys = ["extras"];
      // params:{},URL,token,要的子層陣列
      const resData = await ckanVariable.getCommonListOrCommonPackageList(
        params,
        ckanVariable.ckanGetGroupInfo,
        null,
        keys
      );
      if (resData.success == 200) {
        const extras = resData.data;
        var result = extras.find((item) => item.key === "owner_org");
        if (result && Object.prototype.hasOwnProperty.call(result, "value")) {
          result = result.value;
        } else {
          result = "";
        }
        const owner_org = result;
        try {
          // 確認組織有沒有撞到
          if (owner_org != org && owner_org) {
            throw "this group has the organization already.";
          } else if (owner_org == org && owner_org) {
            throw "this group is already in the organization.";
            // 沒有撞到就添加組織
          } else {
            const extras = [{ key: "owner_org", value: org }];
            const reqData = {
              id: name,
              extras: extras,
            };
            const resData = await ckanVariable.postDataFunction(
              reqData,
              ckanVariable.ckanPostGroupPatch,
              token
            );
            callback();
          }
        } catch (e) {
          console.log(e);
          res.status(403).send(e);
        }
      } else if (resData.success == 500) {
        console.log(resData);
        res.status(resData.success).send(resData.log);
      }
    }
  }

  // 將對象組織的groups欄位拉出來append
  var appendedGroups = [];
  async function appendOrgGroups(callback) {
    const params = {
      id: org,
    };
    const keys = ["groups"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      params,
      ckanVariable.ckanGetOrgShow,
      null,
      keys
    );
    if (resData.success == 200) {
      const org2Groups = resData.data;
      const appendGroup = { name: name };
      org2Groups.push(appendGroup);
      appendedGroups = org2Groups;
      callback();
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData);
    }
  }

  // 把新的groups清單patch回組織
  async function groupOrgAppend() {
    const groups = appendedGroups;
    const reqData = {
      id: org,
      groups: groups,
    };
    console.log(groups);
    const resData = await ckanVariable.postDataFunction(
      reqData,
      ckanVariable.ckanPostOrgPatch,
      token
    );
    if (resData.success == 200) {
      res.status(resData.success).send();
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
// patch
exports.patchResourcePatch = async (req, res) => {
  //做post請求的data參數
  const resourceID = req.body.id;
  const name = req.body.resourceName;

  //前端post過來的OauthToken
  const header = req.headers.authorization;
  //包成key-value
  const headers = {
    Authorization: header,
    "Content-Type": "multipart/form-data",
  };
  // 'resourceFile' 是表單中的檔案欄位名稱

  var fileStructure = {
    file: undefined,
    tempPath: undefined,
    fileName: undefined,
  };
  if (req.file) {
    fileStructure.file = req.file;
    fileStructure.tempPath = req.file.path; //上傳後的臨時路徑
    fileStructure.fileName = req.file.originalname; // 原本的檔名
  }
  // const file = req.file;
  // const tempPath = req.file.path; //上傳後的臨時路徑
  // const fileName = req.file.originalname; // 原本的檔名

  //宣告formdata物件
  const formData = new FormData();
  formData.append("id", resourceID);
  var description = "";
  if (req.body.description) {
    description = req.body.description;
    formData.append("description", description);
  }
  formData.append("name", name);
  if (req.file) {
    //將檔案轉成blob屬性
    const blob = new Blob([fileStructure.file.buffer], {
      type: fileStructure.file.mimetype,
    });
    formData.append("upload", blob, fileStructure.fileName);
    // 砍檔案
    fs.unlink(fileStructure.tempPath, (error) => {
      if (error) {
        throw "remove temporary file failed.";
      }
    });
  }

  //對ckan平台做post請求
  axios
    .post(`${ckanVariable.ckanPostResourcePatch}`, formData, { headers })
    .then((getRes) => {
      const mes = {
        success: true,
      };
      const mesJSON = JSON.stringify(mes, null, 2);
      res.status(200).send(mesJSON);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(axiosErrMesJSON);
    });
};
exports.patchGroupOrgChange = async (req, res) => {
  var id1 = "";
  var id2 = "";
  var delGroup = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      getOrgGroups(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      orgGroupDelete(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      groupOrgChange(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      getNewOrgGroups(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      orgGroupAppend(function () {
        seq_this();
      });
    });

  // 確認request有無效
  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id1) {
          throw "the id(organization) is required.";
        } else {
          id1 = req.body.id1;
        }
        if (!req.body.id2) {
          throw "the id(organization change to) is required.";
        } else {
          id2 = req.body.id2;
        }
        if (!req.body.group) {
          throw "the id(group) is required.";
        } else {
          delGroup = req.body.group;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  // 取得org1的groups清單
  var filteredGroups = [];
  async function getOrgGroups(callback) {
    const params = {
      id: id1,
    };
    const keys = ["groups"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      params,
      ckanVariable.ckanGetOrgShow,
      null,
      keys
    );
    if (resData.success == 200) {
      const groupsArray = resData.data;
      // filteredGroups = orgShow.groups - delGroup
      filteredGroups = groupsArray.filter((item) => delGroup.includes(item));
      callback();
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
  // 把group剔除groups清單
  async function orgGroupDelete(callback) {
    const reqData = {
      id: id1,
      groups: filteredGroups,
    };
    const resData = await ckanVariable.postDataFunction(
      reqData,
      ckanVariable.ckanPostOrgPatch,
      token
    );
    if (resData.success == 200) {
      callback();
    } else if (resData.success == 500) {
      res.status(resData.success).send(resData.log);
    }
  }

  // 把group的owner_org覆蓋成org2
  async function groupOrgChange(callback) {
    const extras = [{ key: "owner_org", value: id2 }];
    const reqData = {
      id: delGroup,
      extras: extras,
    };
    const resData = await ckanVariable.postDataFunction(
      reqData,
      ckanVariable.ckanPostGroupPatch,
      token
    );
    if (resData.success == 200) {
      callback();
    } else if (resData.success == 500) {
      res.status(resData.success).send(resData.log);
    }
  }
  // 取得org2的groups清單
  // 把group加進清單
  var appendedGroups = [];
  async function getNewOrgGroups(callback) {
    const params = {
      id: id2,
    };
    const keys = ["groups"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      params,
      ckanVariable.ckanGetOrgShow,
      null,
      keys
    );
    if (resData.success == 200) {
      const org2Groups = resData.data;
      const appendGroup = { name: delGroup };
      org2Groups.push(appendGroup);
      appendedGroups = org2Groups;
      callback();
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
  // patch回org2的groups欄位
  async function orgGroupAppend() {
    const reqData = {
      id: id2,
      groups: appendedGroups,
    };
    const resData = await ckanVariable.postDataFunction(
      reqData,
      ckanVariable.ckanPostOrgPatch,
      token
    );
    if (resData.success == 200) {
      res.status(resData.success).send();
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};

//delete
exports.delResourceDelete = (req, res) => {
  var resourceID = "";
  var header = "";
  try {
    //做post請求的data參數
    if (req.body.resource_id) {
      resourceID = req.body.resource_id;
    } else {
      throw "resource_id is required.";
    }
    //前端post過來的OauthToken
    if (req.headers.authorization) {
      header = req.headers.authorization;
    } else {
      throw "token is required.";
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  const headers = { Authorization: header };

  var filteredResourceID = [];
  var success = [];
  var fail = [];
  var publicResourceUIDarray = [];

  // 對ckan平台做get請求
  // 先比對請求陣列中的名字有沒有特殊格式
  // filteredResourceID是「沒有特殊格式」的附件ID
  async function checkSplitName(callback) {
    for (var i = 0; i < resourceID.length; i++) {
      const getData = { id: resourceID[i] };
      await axios
        .get(`${ckanVariable.ckanGetResourceShow}`, {
          params: getData,
          headers,
        })
        .then((getRes) => {
          const resourceName = getRes.data.result.name;
          const description = getRes.data.result.description;
          const str = description.split(":");
          const publicResourceUID = str[1];
          const flag = resourceName.includes(resourceSplitName);
          if (flag) {
            fail.push(resourceID[i]);
          } else {
            filteredResourceID.push(resourceID[i]);
            publicResourceUIDarray.push(publicResourceUID);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    callback();
  }
  // 對ckan平台做post請求
  // 以filteredResourceID陣列去做刪除請求
  async function delResource() {
    for (var i = 0; i < filteredResourceID.length; i++) {
      const postPrivateData = { id: filteredResourceID[i] };
      const postPublicData = { id: publicResourceUIDarray[i] };

      if (publicResourceUIDarray[i]) {
        axios
          .post(`${ckanVariable.ckanDelResourceDelete}`, postPublicData, {
            headers,
          })
          .then((getRes) => {
            success.push(publicResourceUIDarray[i]);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      await axios
        .post(`${ckanVariable.ckanDelResourceDelete}`, postPrivateData, {
          headers,
        })
        .then((getRes) => {
          success.push(filteredResourceID[i]);
        })
        .catch((err) => {
          console.log(err);
          fail.push(filteredResourceID[i]);
        });
    }
    var resData = {
      success: success,
      fail: fail,
    };
    var resJSONdata = JSON.stringify(resData, null, 2);
    res.status(200).send(resJSONdata);
  }
  checkSplitName(delResource);
};
exports.delCollaboratorDelete = async (req, res) => {
  var packageID = "";
  var users = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      collaboratorDelete(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(package) is required.";
        } else {
          packageID = req.body.id;
        }
        if (!req.body.users) {
          throw "the users is required.";
        } else {
          users = req.body.users;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  var success = [];
  var fail = [];
  async function collaboratorDelete(callback) {
    for (let i = 0; i < users.length; i++) {
      const reqData = {
        id: orgID,
        username: users[i],
      };
      const resData = await ckanVariable.postDataFunction(
        reqData,
        ckanVariable.ckanDelCollaboratorDelete,
        token
      );
      if (resData.success == 200) {
        success.push(users[i]);
      } else if (resData.success == 500) {
        const error = {
          user: users[i],
          error_log: resData.log,
        };
        fail.push(error);
      }
      if (i == users.length - 1) {
        callback();
      }
    }
  }
  function sendRes() {
    const response = {
      success: success,
      fail: fail,
    };
    res.status(200).send(response);
  }
};
exports.delOrgMemberDelete = async (req, res) => {
  var orgID = "";
  var users = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      orgMemberDelete(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(organization)) is required.";
        } else {
          orgID = req.body.id;
        }
        if (!req.body.users) {
          throw "the users is required.";
        } else {
          users = req.body.users;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  var success = [];
  var fail = [];
  async function orgMemberDelete(callback) {
    for (let i = 0; i < users.length; i++) {
      const reqData = {
        id: orgID,
        username: users[i],
      };
      const resData = await ckanVariable.postDataFunction(
        reqData,
        ckanVariable.ckanDelOrgMemberDelete,
        token
      );
      if (resData.success == 200) {
        success.push(users[i]);
      } else if (resData.success == 500) {
        const error = {
          user: users[i],
          error_log: resData.log,
        };
        fail.push(error);
      }
      if (i == users.length - 1) {
        callback();
      }
    }
  }
  function sendRes() {
    const response = {
      success: success,
      fail: fail,
    };
    res.status(200).send(response);
  }
};
exports.delGroupMemberDelete = async (req, res) => {
  var groupID = "";
  var users = "";
  var token = "";

  //主線佇列
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      groupMemberDelete(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendRes(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(group) is required.";
        } else {
          groupID = req.body.id;
        }
        if (!req.body.users) {
          throw "the users is required.";
        } else {
          users = req.body.users;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  var success = [];
  var fail = [];
  async function groupMemberDelete(callback) {
    for (let i = 0; i < users.length; i++) {
      const reqData = {
        id: groupID,
        username: users[i],
      };
      const resData = await ckanVariable.postDataFunction(
        reqData,
        ckanVariable.ckanDelGroupMemberDelete,
        token
      );
      if (resData.success == 200) {
        success.push(users[i]);
      } else if (resData.success == 500) {
        const error = {
          user: users[i],
          error_log: resData.log,
        };
        fail.push(error);
      }
      if (i == users.length - 1) {
        callback();
      }
    }
  }
  function sendRes() {
    const response = {
      success: success,
      fail: fail,
    };
    res.status(200).send(response);
  }
};
exports.delPackagePurge = async (req, res) => {
  var privateID = "";
  var publicID = "";
  var use = "";
  var token = "";

  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      packagePurge(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      sendResponse(function () {
        seq_this();
      });
    });

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        console.log("req.body:", req.body);
        // console.log("req.body:", req.body);
        if (!req.body.id) {
          console.log("req.body:", req.body.id);
          throw "the id(package) is required.";
        } else {
          privateID = req.body.id;
          const str = privateID.split(packageSplitName);
          publicID = str[0];
          const flag = privateID.includes(packageSplitName);
          if (!flag) {
            throw "please send private package_name.";
          }
        }
        if (!req.body.use_in_private) {
          throw "use_in_private is required.";
        } else {
          use = req.body.use_in_private;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }

  var privateRes = {};
  var publicRes = {};
  async function packagePurge(callback) {
    const reqPublicData = {
      id: publicID,
    };
    publicRes = await ckanVariable.postDataFunction(
      reqPublicData,
      ckanVariable.ckanDelPackagePurge,
      token
    );
    if (use == "false") {
      const reqPrivateData = {
        id: privateID,
      };
      privateRes = await ckanVariable.postDataFunction(
        reqPrivateData,
        ckanVariable.ckanDelPackagePurge,
        token
      );
    }
    callback();
  }
  function sendResponse() {
    var private = "";
    if (use == "true") {
      private = "remain";
    } else {
      private = privateRes.success;
      // test log
      console.log("package_purge.private:", private);
    }
    const response = {
      status: {
        private: private,
        public: publicRes.success,
      },
    };
    res.status(200).send(response);
  }
};
exports.delGroupPurge = async (req, res) => {
  var id = "";
  var token = "";

  function checkReq(callback) {
    try {
      if (!req.body) {
        throw "the body is required.";
      } else {
        if (!req.body.id) {
          throw "the id(group) is required.";
        } else {
          id = req.body.id;
        }
      }
      if (!req.headers.authorization) {
        throw "the token is required.";
      } else {
        token = req.headers.authorization;
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }
  checkReq(groupPurge);
  async function groupPurge() {
    const reqData = {
      id: id,
    };
    const resData = await ckanVariable.postDataFunction(
      reqData,
      ckanVariable.ckanDelGroupPurge,
      token
    );
    if (resData.success == 200) {
      res.status(resData.success).send();
    } else if (resData.success == 500) {
      res.status(resData.success).send(resData.log);
    }
  }
};
exports.delOrgGroupDelete = async (req, res) => {
  seq()
    .seq(function () {
      var seq_this = this;
      checkReq(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      getOrgGroupList(function () {
        seq_this();
      });
    })
    .seq(function () {
      var seq_this = this;
      appendOrgGroupList(function () {
        seq_this();
      });
    });
  // .seq(function(){
  //   var seq_this = this;
  //   checkReq(function() {seq_this();});
  // })

  var token = "";
  var groups = [];
  var orgID = "";

  async function checkReq(callback) {
    try {
      if (req.body.groups) {
        groups = req.body.groups;
      } else {
        throw "groups(array of group name/id) is required.";
      }
      if (req.body.id) {
        orgID = req.body.id;
      } else {
        throw "id(organization) is required";
      }
      if (req.headers.authorization) {
        token = req.headers.authorization;
      } else {
        throw "ckan token is required.";
      }
      callback();
    } catch (e) {
      console.log(e);
      res.status(403).send(e);
    }
  }

  var groupsList = [];
  var deleted = [];
  async function getOrgGroupList(callback) {
    const reqParams = {
      id: orgID,
    };
    const keys = ["groups"];
    // params:{},URL,token,要的子層陣列
    const resData = await ckanVariable.getCommonListOrCommonPackageList(
      reqParams,
      ckanVariable.ckanGetOrgShow,
      null,
      keys
    );
    if (resData.success == 200) {
      const orgGroups = resData.data;
      // filter 篩掉 orgGroups(組織有的群組) 包含 groups(要刪除的群組)的群組
      groupsList = orgGroups.filter((itemA) => !groups.includes(itemA.name));
      deleted = orgGroups.filter((itemA) => groups.includes(itemA.name));
      callback();
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }

  async function appendOrgGroupList() {
    const postData = {
      id: orgID,
      groups: groupsList,
    };
    console.log("postData = " + JSON.stringify(postData));
    // 要post的資料,URL,token
    const resData = await ckanVariable.postDataFunction(
      postData,
      ckanVariable.ckanPostOrgPatch,
      token
    );
    if (resData.success == 200) {
      const response = {
        success: 200,
        deleted: deleted,
      };
      res.status(resData.success).send(response);
    } else if (resData.success == 500) {
      console.log(resData);
      res.status(resData.success).send(resData.log);
    }
  }
};
