import React, {Component,useState, useEffect} from "react";
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content"
import { ckan_api_get_package_list } from "../../global/constants";
import { } from "react";

class DatasetList extends Component{
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }
  callAPI() {
    fetch("http://localhost:9000/ckan/")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
  }
  componentWillMount() {
    this.callAPI();
  }
  //從api取到的資料放到這裡面 做後續渲染
  // const [datasetList, setDatasetList] = useState();
  
  useEffect(() => {
    //網頁開啟時，從ckan取資料
    fetchDatasetList(setDatasetList);
  }, []);

  return(
    <div>
      <Header/>
      <hr/>
      <Content datasetList={datasetList}/>
    </div>
  );
}
export default DatasetList;