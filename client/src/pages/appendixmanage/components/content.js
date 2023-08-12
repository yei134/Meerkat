import React from "react";
import ConRight from "./conright";
import ConLeft from "./conleft";
import axios from 'axios';
import { useState, useEffect, useRef } from "react";

var ownerOrg = "";
// var groups=["app"];
//取得資料集
const Content = ({ datasetName, selectedItems, setSelectedItems }) => {
  // const [symptoms, setSymptoms]=useState([]); //resources.name 病徵名稱
  var [packageDataInfo, setPackageDataInfo] = useState([]);
  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_show`,
          { params: { datasetName: datasetName } })
          .then(response => {
            packageDataInfo = response.data.result;
            setPackageDataInfo(packageDataInfo);
          })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  }, [])
  console.log(packageDataInfo);
  const { title, resources } = packageDataInfo;
  return (
    <div className="contentContainer">
      <ConRight resources={resources} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
      <ConLeft key={datasetName}
        name={datasetName}
        title={title}
      />
    </div>
  );
}
export default Content;