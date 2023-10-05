//client/App.js
//載入套件
import React, { Component, useState, useEffect, useContext } from "react";
import { BrowserRouter, createBrowserRouter, Route, Routes, RouterProvider } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import PrivateRoute from "./helpers/PrivateRoute.js";
import { AuthProvider } from "./helpers/AuthContext";

//載入檔案
import "./App.css";
import Nav from "./components/Nav";
import Upload from "./pages/upload/index";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
// import DatasetInfoU from "./pages/datasetinfoU";
import DatasetList from "./pages/datasetlist";
import Members from "./pages/members";
import DicomManage from "./pages/dicomManage";
import Organization from "./pages/organization";
import DatasetEdit from "./pages/datasetEdit";
import Header from "./components/header";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <AuthProvider>
      <DatasetList />
      // </AuthProvider>
    ),
  },
  {
    path: "datasetInfo/:getId",
    element: (
      <PrivateRoute>
        {/* <AuthProvider> */}
        <DatasetInfo />
        {/* </AuthProvider> */}
      </PrivateRoute>
    ),
  },
  // {
  //   path: "datasetInfoU/:getId",
  //   element: (
  //     <PrivateRoute>
  //       <AuthProvider>
  //       <DatasetInfoU />
  //       </AuthProvider>
  //     </PrivateRoute>
  //   ),
  // },
  {
    path: "newDataset",
    element: (
      <PrivateRoute>
        {/* <AuthProvider> */}
        <NewDataset />
        {/* </AuthProvider> */}
      </PrivateRoute>
    ),
  },
  {
    path: "datasetInfo/:getId/fileUpload",
    element: (
      <PrivateRoute>
        {/* <AuthProvider> */}
        <Upload />
        {/* </AuthProvider> */}
      </PrivateRoute>
    ),
  },
  {
    path: "datasetInfo/:getId/dicomManage",
    element: (
      <PrivateRoute>
        <DicomManage />
      </PrivateRoute>
    ),
  },
  {
    path: "organization",
    element: <Organization />,
  },
  {
    path: "datasetInfo/:getId/datasetEdit",
    element: (
      <PrivateRoute>
        <DatasetEdit />
      </PrivateRoute>
    ),
  },
  {
    path: "members",
    element: (
      <PrivateRoute>
        {/* <AuthProvider> */}
        <Members />
        {/* </AuthProvider> */}
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
          <div className="nullDiv" />
          {/* <Nav /> */}
          <RouterProvider router={router} />
        </ReactKeycloakProvider>
      </>
    );
  }
}

export default App;

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqRmtadk83VFJlSG5FNC1XcXBrc2E5VXl2X1o3OFAyd18yVjlhMW51NzJmTTI4ck1DOW1lcFI2QlUtR0pHc1VFVHVaLUdfaEdpVjBBZ0NyTCIsImlhdCI6MTY4OTY4MjczOH0.D4WxmjsJtY_BIv--UEBRVk6ev1LSNARJTJUZTN1AmpE
