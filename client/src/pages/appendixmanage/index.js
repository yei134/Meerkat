// 套件
import { useState } from "react";
import { useParams } from "react-router-dom";
// 檔案
import "./index.css";
import ActionBotton from "./components/actionBotton";
import Content from "./components/content";
import UploadFile from "./components/uplaodBotton";

function Apendmanage() {
  const datasetName = useParams();
  const [selectedItems, setSelectedItems] = useState([]); // selectedItems 勾選狀態
  const [fileUploadCount, setFileUploadCount] = useState(0); // fileUploadCount上傳計數

  return (
    <>
      <div className="buttonArea">
        {/* 刪除 */}
        <ActionBotton selectedItems={selectedItems} fileUploadCount={fileUploadCount} setFileUploadCount={setFileUploadCount} />
        {/* 上傳 */}
        <UploadFile datasetName={datasetName.getId} fileUploadCount={fileUploadCount} setFileUploadCount={setFileUploadCount} />
      </div>
      <Content datasetName={datasetName.getId} selectedItems={selectedItems} setSelectedItems={setSelectedItems} fileUploadCount={fileUploadCount} />
    </>
  );
}
export default Apendmanage;
//    _____ home______
//   |            |       |
// action(後端刪除，取得點選的id陣列)  content   header
//                  |
//            conleft+conright(勾選狀態)
