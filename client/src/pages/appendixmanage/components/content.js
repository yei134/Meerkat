import React from "react";
import ConRight from "./conright";
import ConLeft from "./conleft";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//取得資料集
const Content = ({ datasetName, selectedItems, setSelectedItems }) => {
  const navigate = useNavigate();
  const [datasetInfo, setDatasetInfo] = useState({ name: datasetName });

  async function getCkanApiPackageShow() {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, {
        params: { datasetName: datasetInfo.name },
        headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN },
      })
      .then((response) => {
        const tmp = response.data;
        setDatasetInfo(tmp);
      })
      .catch((e) => {
        alert("頁面獲取失敗，請從新獲取");
        navigate(`/datasetInfo/${datasetName}`);
      });
  }

  // ==當資料集資訊更新時更新標題==
  useEffect(() => {
    getCkanApiPackageShow();
  }, [datasetName]);

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
