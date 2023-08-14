const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 指定上傳後的目錄

module.exports = app => {
  const router = require("express").Router();
  const bodyParser = require('body-parser');
  router.use(bodyParser.json());
  const ckanAPI = require("../controllers/ckanAPI_controller.js");

  // ckanAPI area
  // get
  router.get("/", ckanAPI.checkGet);
  router.get("/package_list", ckanAPI.getPackageList);
  router.get("/package_show", ckanAPI.getPackageShow);
  router.get("/package_search", ckanAPI.getPackageSearch);
  router.get("/resource_show", ckanAPI.getResourceShow);

  // post
  router.post("/", ckanAPI.checkPost);
  router.post("/package_create", ckanAPI.postPackageCreate);
  router.post("/resource_create", upload.single('resourceFile'), ckanAPI.postResourceCreate);
  router.post("/index_create", ckanAPI.postIndexCreate);

  // patch
  router.post("/resource_patch", upload.single('resourceFile'), ckanAPI.postResourcePatch);

  // delete
  router.delete("/resource_delete", ckanAPI.delResourceDelete);

  app.use("/ckanAPI", router);
};