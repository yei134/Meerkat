import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content"
import { ckan_api_get_package_list } from "../../global/constants";
import { useState, useEffect} from "react";
import axios from "axios"

//去ckan資料庫拿東西出來
// async function fetchDatasetList(setDatasetList) {
//   const res = await fetch(ckan_api_get_package_list);
//   const { datasetList } = await res.json();
//   setDatasetList(datasetList);
// }

function DatasetList(){
  //從api取到的資料放到這裡面 做後續渲染
  const [datasetList, setDatasetList] = useState();
  
  // useEffect(() => {
  //   //網頁開啟時，從ckan取資料
  //   fetchDatasetList(setDatasetList);
  // }, []);
  useEffect(() => {
    //網頁開啟時，從ckan取資料
    return axios.get(ckan_api_get_package_list)
 .then((response) => console.log(response.data));
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