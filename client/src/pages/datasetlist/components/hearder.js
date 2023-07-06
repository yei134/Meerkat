import React from "react";

const Header = () => {
  return (
    <header>
      <div className="head">
        <div>
          <img src="LOGO.svg" className="logo1"></img>
          <h1>AI&nbsp;Data&nbsp;Sharing</h1>
        </div>
        <div className="button_pic">
          <button className="button1" ><a href="newDataset">新增資料集</a></button>
        </div>
      </div>
    </header>
  );
};

export default Header;