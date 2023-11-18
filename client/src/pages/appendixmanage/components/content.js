import React from "react";
import ConRight from "./conright";
import ConLeft from "./conleft";
import axios from "axios";
import { useState, useEffect } from "react";

//取得資料集
const Content = ({ datasetName, selectedItems, setSelectedItems, fileUploadCount }) => {
  const [datasetInfo, setDatasetInfo] = useState({});
  const [title, setTitle] = useState();

  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, {
            params: { datasetName: datasetName },
            headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN },
          })
          .then((response) => {
            const tmp = response.data;
            setDatasetInfo(tmp);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getDataset();
  }, [fileUploadCount]);

  // ==當資料集資訊更新時更新標題==
  useEffect(() => {
    const getData = () => {
      setTitle(datasetInfo.title);
    };
    getData();
  }, [datasetInfo]);

  return (
    <div className="contentContainer">
      {/* 資訊欄 */}
      <ConLeft datasetInfo={datasetInfo} />
      {/* 附件列表 */}
      <ConRight resources={datasetInfo.resources} selectedItems={selectedItems} setSelectedItems={setSelectedItems} name={datasetName} title={title} />
    </div>
  );
};
export default Content;
