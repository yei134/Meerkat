import React, {Component} from "react";
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content"
import { ckan_test_1 } from "../../global/constants";

class DatasetList extends Component{
  constructor(props) {
    super(props);
    this.state ={datasetList: []};//定義需要的欄位與類型
  }
  callAPI() {
    fetch(ckan_test_1+"/package_list")
        .then(res => res.json())//把取過來的資料從cros改成json
        .then(res => res.result)//只取result欄位
        .then(res => this.setState({datasetList: res}))//把取到的值存放到類別變數裡面
        .catch(err => err);
  }
  componentWillMount() {
    this.callAPI();
  }  
  render(){
    return(
      <div>
        <Header/>
        <hr/>
        <Content datasetList={this.state.datasetList}/>
      </div>
    );
  }
}
export default DatasetList;