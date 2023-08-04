const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 指定上傳後的目錄

module.exports = app => {
  const ckanAPI = require("../controllers/ckanAPI_controller.js");
  var router = require("express").Router();

  // check route working here

  // ckanAPI area
  // get
  router.get("/", ckanAPI.checkGet);
  router.get("/package_list", ckanAPI.getPackageList);
  router.get("/package_show", ckanAPI.getPackageShow);
  router.get("/package_search", ckanAPI.getPackageSearch);

  // ckanAPI area
  // post
  router.post("/", ckanAPI.checkPost);
  router.post("/package_create", ckanAPI.postPackageCreate);
  router.post("/resource_create", ckanAPI.postResourceCreate);

  // ckanAPI area
  // patch
  router.post("/resource_patch", upload.single('resourceFile'), ckanAPI.postResourcePatch);

  // ckanAPI area
  // delete
  router.post("/resource_delete", ckanAPI.postResourceDelete);

  app.use("/ckanAPI", router);
};