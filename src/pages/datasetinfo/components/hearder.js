import React from "react";

const Header = () => {
  function switchDicomUpload() {
    console.log("dicom upload");
  }
  function switchDicomManage() {
    console.log("dicom manage");
  }
  function switchFileManage() {
    console.log("file manage");
  }
  return (
    <div classname="div">
      <div className="head">AI&nbsp;Data&nbsp;Sharing</div>
      <div classname="div">
        <button className="add"><a href="manage/fileUpload" className="ahref">上傳dicom</a></button>
        <button className="add"><a href="manage/fileUpload" className="ahref">管理dicom</a></button>
        <button className="add"><a href="manage/fileUpload" className="ahref">管理附件</a></button>
      </div>
    </div>
  );
};

export default Header;