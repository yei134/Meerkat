import { useState } from "react";
import "./index.css";

import ActionBotton from "./components/actionBotton"; //檔案上傳操作按鈕
import Content from "./components/Content"; //選擇的檔案上傳暫存顯示表格
import Header from "./components/Header";

function Apendmanage() {
  //定義一個react偵測到有變動時要渲染的東西
  //假資料(待改)--->後續接後端須改的地方
  const [uploadFile, setUploadFile] = useState([ {
    id: 1,
    fileName: "example1.pdf",
    processingProgress: "2023-05-05 12:30:00",
    fileSize: 2345678,
    isChecked: false,
  },
  {
    id: 2,
    fileName: "example2.pdf",
    processingProgress: "2023-05-05 13:00:00",
    fileSize: 9876543,
    isChecked: false,
  },]);
  return (
    <div className="divHeader">
      <Header />
      <ActionBotton setUploadFile={setUploadFile} deletealldata={setUploadFile} setstatus={setUploadFile} />
      <hr className="hr" />
      <Content uploadFile={uploadFile} setUploadFile={setUploadFile} />
    </div>
  );
}

export default Apendmanage;


//    _____ home______ 
//   |        |       |    
// action  content   header
//            |
//          item

