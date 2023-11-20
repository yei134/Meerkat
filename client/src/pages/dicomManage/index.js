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

  return <Content key={datasetName} datasetName={datasetName} />;
}

export default DicomManage;
