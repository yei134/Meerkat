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
  router.get("/group_list", ckanAPI.getGroupList);
  router.get("/tag_list", ckanAPI.getTagList);
  router.get("/organization_list", ckanAPI.getOrgList);
  router.get("/group_package_list", ckanAPI.getGroupPackageList);
  router.get("/tag_package_list", ckanAPI.getTagPackageList);
  router.get("/organization_package_list", ckanAPI.getOrgPackageList);
  router.get("/group_info", ckanAPI.getGroupInfo);
  router.get("/tag_info", ckanAPI.getTagInfo);
  router.get("/organization_info", ckanAPI.getOrgInfo);
  router.get("/collaborator_list", ckanAPI.getCollaboratorList);
  router.get("/collaborator_list_for_user", ckanAPI.getUserCollaboratorList);
  router.get("/organization_list_for_user", ckanAPI.getUserOrgList);


  // post
  router.post("/", ckanAPI.checkPost);
  router.post("/package_create", ckanAPI.postPackageCreate);
  router.post("/package_patch", ckanAPI.postPackagePatch);
  router.post("/resource_create", upload.single('resourceFile'), ckanAPI.postResourceCreate);
  router.post("/index_create", ckanAPI.postIndexCreate);
  router.post("/package_filter", ckanAPI.getFilteredPackageList);
  router.post("/collaborator_edit", ckanAPI.postCollaboratorEdit);
  router.post("/organization_member_edit", ckanAPI.postOrgMemberEdit);
  router.post("/group_member_edit", ckanAPI.postGroupMemberEdit);
  router.post("/organization_group_append", ckanAPI.postOrgGroupAppend);

  // patch
  // router.patch("/resource_patch", upload.single('resourceFile'), ckanAPI.postResourcePatch);
  router.patch("/group_organization_patch", ckanAPI.patchGroupOrgChange);

  // delete
  router.delete("/resource_delete", ckanAPI.delResourceDelete);
  router.delete("/organization_member_delete", ckanAPI.delOrgMemberDelete);
  router.delete("/collaborator_delete", ckanAPI.delCollaboratorDelete);
  router.delete("/group_purge", ckanAPI.delGroupPurge);

  // router.delete("/package_purge", ckanAPI.delPackagePurge);
  router.delete("/group_member_delete", ckanAPI.delGroupMemberDelete);

  app.use("/api/ckan", router);
};