//client/App.js
//載入套件
import React, {Component} from "react";
import { 
  BrowserRouter, 
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
//載入檔案
import Upload from "./pages/upload/index";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
import DatasetList from "./pages/datasetlist";
import DicomManage from "./pages/dicomManage";
import Organization from "./pages/organization";
import DatasetEdit from "./pages/datasetEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DatasetList/>,
  },
  {
    path: "datasetInfo/:getId",
    element: <DatasetInfo />,
  },
  {
    path:"newDataset",
    element:<NewDataset />,
  },
  {
    path:"datasetInfo/:getId/fileUpload/:getSymptom",
    element:<Upload />,
  },
  {
    path:"datasetInfo/:getId/dicomManage",
    element:<DicomManage/>,
  },
  {
    path:"organization",
    element:<Organization/>,
  },
  {
    path:"datasetInfo/:getId/datasetEdit",
    element:<DatasetEdit/>,
  }
]);
// 介面所需框架集合
class App extends Component{  
  render(){
    return (
      <RouterProvider router={router} />
    );
  }  
}

export default App;