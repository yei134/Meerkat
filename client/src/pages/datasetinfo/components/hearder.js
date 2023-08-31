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
        <button className="button"><a href="/datasetInfo" className="a">管理附件</a></button>
        <button className="button"><a href={`/datasetInfo/${datasetName}/dicomManage`} className="a">管理dicom</a></button>
        <button className="button"><a href="/datasetInfo" className="a">申請資料集</a></button>
      </div>
    </header>
  );
};

export default Header;