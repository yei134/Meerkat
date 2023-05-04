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
    <div className="flex-container-header">
      {/* <img className="divimage" src="./LOGO.svg"></img> */}
      <h1 className="h1"><a href="/">AI&nbsp;Data&nbsp;Sharing</a></h1>
      <div className="rightdiv">
        <button className="button"><a href="/fileUpload" className="a">上傳dicom</a></button>
        <button className="button"><a href="/datasetInfo" className="a">管理dicom</a></button>
        <button className="button"><a href="/datasetInfo" className="a">管理附件</a></button>
      </div>
    </div>
  );
};

export default Header;
/*
        <button onClick={switchDicomUpload}>上傳dicom</button>
        <button onClick={switchDicomManage}>管理dicom</button>
        <button onClick={switchFileManage}>管理附件</button>
        */