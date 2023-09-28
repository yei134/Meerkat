import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

const Header = () => {
  return (
    <header>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <h1><img src="LOGO.svg" className="logo"></img><div>AI&nbsp;Data&nbsp;Sharing</div></h1>
      <div>
        <button className="button1" ><a href="newDataset"><InsertDriveFileIcon className="icon" />新增資料集</a></button>
      </div>
    </header>
  );
};

export default Header;