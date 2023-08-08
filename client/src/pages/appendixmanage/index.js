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
  const [uploadFile, setUploadFile] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <>
      <div className="head">
        <Header />
        <ActionBotton setUploadFile={setUploadFile} selectedItems={selectedItems}  />
        <UploadFile  datasetName={datasetName.getId}/>
        </div>
      <Content   datasetName={datasetName.getId}  selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
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

