import React from "react";
import ConRight from "./conright";
import ConLeft from "./conleft";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//取得資料集
const Content = ({ datasetInfo, selectedItems, setSelectedItems }) => {
  return (
    <div className="contentContainer">
      {/* 資訊欄 */}
      <ConLeft datasetInfo={datasetInfo} />
      {/* 附件列表 */}
      <ConRight resources={datasetInfo.resources} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
    </div>
  );
};
export default Content;
