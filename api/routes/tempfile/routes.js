module.exports = app => {
  const ckanAPI = require("../controllers/ckanAPI_controller.js");
  var router = require("express").Router();

  // check route working here

  // ckanAPI area
  // get
  router.get("/", ckanAPI.checkGet);
  router.get("/package_list", ckanAPI.getPackageList);
  router.get("/package_show", ckanAPI.getPackageShow);

  // ckanAPI area
  // post
  router.post("/", ckanAPI.checkPost);
  router.post("/package_create", ckanAPI.postPackageCreate);

  // ckanAPI area
  // put

  // ckanAPI area
  // delete

  app.use("/ckanAPI", router);
};