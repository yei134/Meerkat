import React from "react";

const Header = () => {
  return (
    <header>
      <h1><img src="LOGO.svg" className="logo"></img><div>AI&nbsp;Data&nbsp;Sharing</div></h1>
      <div>
        <button className="button1" ><a href="newDataset">新增資料集</a></button>
      </div>
    </header>
  );
};

export default Header;