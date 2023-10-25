//套件
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//檔案
import "./index.css";
import Content from "./components/content";

function DicomManage() {
  const datasetNameId = useParams(); //擷取路徑value
  const datasetName = datasetNameId.getId; //從路徑value拿取datasetName
  const [packageDataInfo, setPackageDataInfo] = useState([]);
  const [datasetTitle, setDatasetTitle] = useState();
  const [files, setFiles] = useState([]);

  //=== 以package_show拿取當前資料集之資料 ===//
  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, { params: { datasetName: datasetName }, headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } })
          .then((res) => {
            const tmp = res.data;
            setPackageDataInfo(tmp);
            const tmp_files = tmp.resources.map((resource) => resource);
            setFiles(tmp_files);
            setDatasetTitle(tmp.title);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getDataset();
  }, []);

  return <Content key={datasetName} datasetName={datasetName} datasetTitle={datasetTitle} files={files} />;
}

export default DicomManage;
