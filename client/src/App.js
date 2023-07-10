//client/App.js
//載入套件
import React, {Component} from "react";
import { 
  BrowserRouter, 
  createBrowserRouter,
  Route,
  Routes,
  RouterProvider
} from "react-router-dom";
import Keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import PrivateRoute from "./helpers/PrivateRoute";
//載入檔案
import Nav from "./components/Nav";
import Upload from "./pages/upload/index";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
import DatasetList from "./pages/datasetlist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DatasetList/>,
  },
  {
    path: "datasetInfo/:getId",
    element:(
      <PrivateRoute>
        <DatasetInfo />
      </PrivateRoute>
    )
  },
  {
    path: "newDataset",
    element:(
      <PrivateRoute>
        <NewDataset />
      </PrivateRoute>
    )
  },
  {
    path: "datasetInfo/:getId/fileUpload",
    element:(
      <PrivateRoute>
        <Upload />
      </PrivateRoute>
    )
  }
]);
//介面所需框架集合
class App extends Component{  
  render(){
    return (
	<div>
      <ReactKeycloakProvider authClient={Keycloak}>
        <Nav />
        <RouterProvider router={router} />
      </ReactKeycloakProvider>
	</div>
    );
  }  
}

export default App;
