import { useState } from "react";
import "./index.css";
import { 
  BrowserRouter, 
  createBrowserRouter,
  RouterProvider,
  Route, 
  Routes,
  useLocation,
  useParams 
} from "react-router-dom";
import ActionBotton from "./components/actionBotton"; 
import Content from "./components/content"; 
import Header from "./components/header";
import UploadFile from "./components/uplaodBotton";

function Apendmanage() {

  const datasetName=useParams()
  const [selectedItems, setSelectedItems] = useState([]);
  const [fileUploadCount, setFileUploadCount] = useState(0);
 // selectedItems 勾選狀態 fileUploadCount上傳計數

  return (
    <>
      <div className="head">
        <Header />
        </div>
        <ActionBotton  selectedItems={selectedItems} fileUploadCount={fileUploadCount} setFileUploadCount={setFileUploadCount} />
        <UploadFile  datasetName={datasetName.getId} fileUploadCount={fileUploadCount} setFileUploadCount={setFileUploadCount}/>
      <Content   datasetName={datasetName.getId}  selectedItems={selectedItems} setSelectedItems={setSelectedItems} fileUploadCount={fileUploadCount}/>
      <div>&nbsp;</div>{/* 美觀用 */}
    </>
  );
}
export default Apendmanage;
//    _____ home______ 
//   |            |       |    
// action(後端刪除，取得點選的id陣列)  content   header
//                  |
//            conleft+conright(勾選狀態)

