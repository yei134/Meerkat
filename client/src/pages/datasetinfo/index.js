import { useState, useEffect, useRef } from "react";
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content"
import { api_get_data_newSet } from "../../global/constants";
import { api_get_symptoms } from "../../global/constants";
import axios from "axios";

function DatasetInfo({params}) {
  const [info,setInfo]=useState({});
  useEffect(()=>{
    axios.get(
      `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show`,
      {params:{datasetName:params.dataset}}
    )
      .then(response=>setInfo(response))
      .catch(error=>console.log(error));
  })
  return(
    <>
      <p>{params.dataset}</p>
    </>
  )
}

// async function fetchDataset(setDataset) {
//   const res = await fetch(api_get_data_newSet);
//   const { dataset } = await res.json();
//   setDataset(dataset);
//   console.log(dataset);
// }

// async function fetchSymptoms(setSymptoms) {
//   const res = await fetch(api_get_symptoms);
//   const { symptoms } = await res.json();
//   setSymptoms(symptoms);
// }

// function DatasetInfo(){
//   const [dataset, setDataset] = useState([]);//要新增的資料集
//   const [symptoms, setSymptoms] = useState([]);//病徵

//   useEffect(() => {
//     //網頁開啟時，從json取資料
//     fetchDataset(setDataset);
//     fetchSymptoms(setSymptoms);
//   }, []);

//   return(
//     <div className="pagediv">
//       <Header/>
//       <hr/>
//       <Content
//         listDataset={dataset}
//         listSymptoms={symptoms}
//       />
//     </div>
//   );
// }
export default DatasetInfo;