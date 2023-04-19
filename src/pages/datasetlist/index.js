import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content"
import { ckan_api_get_package_list } from "../../global/constants";
import { useState, useEffect} from "react";
import axios from "axios"

//去ckan資料庫拿東西出來
const fetchDatasetList = async (setDatasetList) => {
  try {
    const response = await fetch(
      ckan_api_get_package_list, 
      { mode: 'cors',
      headers:{"a_custom_header":"custom_value"} }
    );
    const jsonData = await response.json();
    setDatasetList(jsonData);
  } catch (error) {
    console.log(error);
  }
};

function DatasetList(){
  //從api取到的資料放到這裡面 做後續渲染
  const [datasetList, setDatasetList] = useState();
  
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