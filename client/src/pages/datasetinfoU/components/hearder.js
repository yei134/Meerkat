import React from "react";

const Header = ({datasetName}) => {
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
    <header className="head container">
      <div className="test">
        <a href="/"><img src="../LOGO.svg" className="logo1"></img></a>
        <h1><a href="/">AI&nbsp;Data&nbsp;Sharing</a></h1> 
      </div>  
      <div>
        <button className="button"><a href="/datasetInfo" className="a">申請資料</a></button>
      </div>
    </header>
  );
};

export default Header;
/*
        <button onClick={switchDicomUpload}>上傳dicom</button>
        <button onClick={switchDicomManage}>管理dicom</button>
        <button onClick={switchFileManage}>管理附件</button>
        */