const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 指定上傳後的目錄

module.exports = app => {
  const raccoonAPI = require("../controllers/raccoonAPI_controller.js");
  var router = require("express").Router();

  // raccoonAPI area
  // get
  router.get("/", raccoonAPI.checkGet);
  router.get("/studies", raccoonAPI.getStudiesList);

  // raccoonAPI area
  // post
  router.post("/", raccoonAPI.checkPost);
  router.post("/studiesNew", upload.array('dicomFiles'), raccoonAPI.postStudies);

  // raccoonAPI area
  // put

  // raccoonAPI area
  // delete

  app.use("/raccoonAPI", router);
};