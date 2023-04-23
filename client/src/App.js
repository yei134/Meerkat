//client/App.js
//載入套件
import React, {Component} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//載入檔案
import Upload from "./pages/upload/index";
import ModelUpload from "./pages/ModelUpload/index";
import Home from "./pages/home";
import NewDataset from "./pages/newdataset";
import DatasetInfo from "./pages/datasetinfo";
import DatasetList from "./pages/datasetlist";
import { ckan_test_1 } from "./global/constants";


// 介面所需框架集合
class App extends Component{
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }
  callAPI() {
    fetch(ckan_test_1+"/package_list")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
  }
  componentWillMount() {
    this.callAPI();
  }
  render(){
    return (
      <div>
      {/* <p>{this.state.apiResponse}</p> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" />
            <Route path="manage/" element={<Home />}/>
            <Route path="fileUpload" element={<Upload />} />
            <Route path="modelUpload" element={<ModelUpload />} />
            <Route path="edit/">
              <Route path="newDataset" element={<NewDataset />} />
            </Route>
            <Route path="test/" element={<DatasetInfo/>}/>
            <Route path="info/" element={<DatasetList/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }  
}

export default App;
