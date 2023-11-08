import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";

import ActionBotton from "./components/actionBotton"; //檔案上傳操作按鈕
import Content from "./components/Content"; //選擇的檔案上傳暫存顯示表格

function Upload() {
  //定義一個react偵測到有變動時要渲染的東西
  const [uploadFile, setUploadFile] = useState([]);
  const datasetName=useParams();

  return (
    <>
      <div className="head">
        <ActionBotton  datasetName={datasetName.getId} uploadFile={uploadFile} symptomId={datasetName.getSymptom} setUploadFile={setUploadFile} deletealldata={setUploadFile} />
      </div>
      <Content uploadFile={uploadFile} setUploadFile={setUploadFile} symptomId={datasetName.getSymptom}/>
    </>
  );
}

export default Upload;