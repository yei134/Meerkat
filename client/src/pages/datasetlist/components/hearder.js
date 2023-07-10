import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Header = () => {
  return (
    <header>
      <h1><img src="LOGO.svg" className="logo"></img><div>AI&nbsp;Data&nbsp;Sharing</div></h1>
      {/* <a href="/">首頁</a> */}
      <div>
        <button className="button1" ><a href="newDataset"><InsertDriveFileIcon className="icon" />新增資料集</a></button>
      </div>
    </header>
  );
};

export default Header;