const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 指定上傳後的目錄

module.exports = app => {
  const raccoonAPI = require("../controllers/raccoonAPI_controller.js");
  var router = require("express").Router();

  // get
  router.get("/", raccoonAPI.checkGet);
  router.get("/studies", raccoonAPI.getStudiesList);

  // post
  router.post("/", raccoonAPI.checkPost);
  router.post("/studiesAppend", upload.single('dicomFile'), raccoonAPI.postStudiesAppend);

  // put

  // delete
  router.delete("/studiesDelete", raccoonAPI.postStudiesDelete);

  app.use("/api/raccoon", router);
};