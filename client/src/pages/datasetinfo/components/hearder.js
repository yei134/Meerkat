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
    <div>
      <div>AI&nbsp;Data&nbsp;Sharing</div>
      <div>
        <button onClick={switchDicomUpload}>上傳dicom</button>
        <button onClick={switchDicomManage}>管理dicom</button>
        <button onClick={switchFileManage}>管理附件</button>
      </div>
    </div>
  );
};

export default Header;