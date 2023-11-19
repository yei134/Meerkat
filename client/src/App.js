//client/App.js
//載入套件
import React, { Component } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import PrivateRoute from "./helpers/PrivateRoute.js";

//載入檔案
import "./App.css";
import Upload from "./pages/upload/index";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
import DatasetList from "./pages/datasetlist";
import Members from "./pages/members";
import DicomManage from "./pages/dicomManage";
import Organization from "./pages/organization";
import DatasetEdit from "./pages/datasetEdit";
import Header from "./components/header";
import Apendmanage from "./pages/appendixmanage";

const router = createBrowserRouter([
  {
    path: "/",
    // 資料集總表
    element: <DatasetList />,
  },
  {
    path: "datasetInfo/:getId",
    // 資料集資訊
    element: (
      <PrivateRoute>
        <DatasetInfo />
      </PrivateRoute>
    ),
  },
  {
    path: "newDataset",
    // 新增資料集
    element: (
      <PrivateRoute>
        <NewDataset />
      </PrivateRoute>
    ),
  },
  {
    path: "datasetInfo/:getId/fileUpload/:getSymptom/:getSymptomId",
    // dicom檔案上傳
    element: (
      <PrivateRoute>
        <Upload />
      </PrivateRoute>
    ),
  },
  {
    path: "datasetInfo/:getId/dicomManage",
    // dicom檔案管理
    element: (
      <PrivateRoute>
        <DicomManage />
      </PrivateRoute>
    ),
  },
  {
    path: "organization",
    // 組資資訊
    element: <Organization />,
  },
  {
    path: "datasetInfo/:getId/datasetEdit",
    // 資料集資訊修改
    element: (
      <PrivateRoute>
        <DatasetEdit />
      </PrivateRoute>
    ),
  },
  {
    path: "members",
    // 人員管理
    element: (
      <PrivateRoute>
        <Members />
      </PrivateRoute>
    ),
  },
  {
    path: "/datasetInfo/:getId/appendixmanage",
    // 資料集附件管理與上傳
    element: (
      <PrivateRoute>
        <Apendmanage />
      </PrivateRoute>
    ),
  },
]);
//介面所需框架集合
class App extends Component {
  render() {
    return (
      <>
        <ReactKeycloakProvider authClient={Keycloak}>
          <Header />
          {/* 避免資料被header擋住 */}
          <div className="nullDiv">
            <RouterProvider router={router} />
          </div>
        </ReactKeycloakProvider>
      </>
    );
  }
}

export default App;
