//資料集新增頁面
import { useState, useEffect, useRef } from "react";
import { api_get_data_newSet } from "../../global/constants";
import Edit from "./components/edit";
import "./index.css";
import { Outlet } from "react-router-dom";

//去json資料庫拿東西出來
async function fetchDataset(setDataset) {
  const res = await fetch(api_get_data_newSet);
  const { dataset } = await res.json();
  setDataset(dataset);
}

//將要新增的資料集存至json內 注意:之後需要寫api推給ckan
async function putDataset(dataset) {
  await fetch(api_get_data_newSet, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ dataset }),
  });
}

const NewDataset = () => {
  //定義一個react偵測到有變動時要渲染的東西
  const [dataset, setDataset] = useState([]);
  const submittingState = useRef(false);

  //當頁面刷新的時候會自動執行下方兩個useEffect
  //定義有變動時要做的動作
  useEffect(() => {
    //matter有變動時，存資料到json
    if (!submittingState.current) {
      //但是當畫面初始化的時候不要把空資料夾更新到json
      return;
    }
    putDataset(dataset).then((dataset) => (submittingState.current = false)); //要更新json的時候，更改狀態，更新好後再把狀態改回來
  }, [dataset]);

  useEffect(() => {
    //網頁開啟時，從json取資料
    fetchDataset(setDataset);
  }, []);
  
  return (
    <div className="app">
      <Edit add={setDataset} submittingState={submittingState} dataset={dataset}/>
      <Outlet />
    </div>
  );
};

export default NewDataset;
