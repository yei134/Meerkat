//client/App.js
//載入套件
import React, {Component} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//載入檔案
import Upload from "./pages/upload/index";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
import DatasetList from "./pages/datasetlist";


// 介面所需框架集合
class App extends Component{  
  render(){
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DatasetList/>}/>{/*資料集清單*/}
            <Route path="datasetInfo" element={<DatasetInfo/>}/>
            <Route path="newDataset" element={<NewDataset />} />
            <Route path="fileUpload" element={<Upload />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }  
}

export default App;
