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
      </div>
    </header>
  );
};

export default Header;