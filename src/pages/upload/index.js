import { useState } from "react";
import "./index.css";

import ActionBotton from "./components/actionBotton"; //檔案上傳操作按鈕
import Content from "./components/Content"; //選擇的檔案上傳暫存顯示表格
import Header from "./components/Header";

function Upload() {
  //定義一個react偵測到有變動時要渲染的東西
  const [uploadFile, setUploadFile] = useState([]);

  return (
    <div>
      <Header />
      <ActionBotton setUploadFile={setUploadFile} deletealldata={setUploadFile} setstatus={setUploadFile} />
      <Content uploadFile={uploadFile} setUploadFile={setUploadFile} />
    </div>
  );
}

export default Upload;
