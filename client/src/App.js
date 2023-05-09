//client/App.js
//載入套件
import React, {Component} from "react";
import { 
  BrowserRouter, 
  createBrowserRouter,
  RouterProvider,
  Route, 
  Routes,
  Link,
  Form, 
  useLoaderData
} from "react-router-dom";
//載入檔案
import Upload from "./pages/upload/index";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
import DatasetList from "./pages/datasetlist";
// import DatasetInfo, {loader as datasetLoader,} from "./pages/datasetinfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DatasetList/>,
  },
  {
    path: "datasetInfo/:dataset",
    element: <DatasetInfo />,
  },
  {
    path:"newDataset",
    element:<NewDataset />,
  },
  {
    path:"fileUpload",
    element:<Upload />,
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
