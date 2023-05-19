import React from "react";

const Header = () => {
  return (
    <header>
      <h1><div>AI&nbsp;Data&nbsp;Sharing</div></h1>
      <nav>
        <ul>
          <li>
            {/* <a href="/datasetInfo">datasetInfo</a> */}
          </li>
          <li>
            {/* <a href="/newDataset">newDataset</a> */}
          </li>
          <li>
            {/* <a href="/manage">manage</a> */}
          </li>
          <li>
            {/* <a href="/fileUpload">fileUpload</a> */}
          </li>
        </ul>
      </nav>
      <div>
        <button  className="newDatasetBtn"><a href="newDataset">新增資料集</a></button>
      </div>
    </header>
  );
};

export default Header;