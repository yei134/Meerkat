const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 指定上傳後的目錄

module.exports = app => {
  const mongoAPI = require("../controllers/mongoAPI_controller.js");
  var router = require("express").Router();
  
  // mongoAPI area
  // get
  router.get("/", mongoAPI.checkGet);
  router.get("/accountDocs", mongoAPI.getAccountDocs);

  // mongoAPI area
  // post
  router.post("/", mongoAPI.checkPost);
  router.get("/docUpload", upload.single('proposalFile'), mongoAPI.postDocUpload);
  router.get("/formUpload", mongoAPI.postFormUpload);

  // mongoAPI area
  // put

  // mongoAPI area
  // delete

  app.use("/mongoAPI", router);
};