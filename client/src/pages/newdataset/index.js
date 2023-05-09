//資料集新增頁面
import { useState, useEffect, useRef } from "react";
import { api_get_data_newSet } from "../../global/constants";
import { api_get_symptoms } from "../../global/constants";
import Edit from "./components/edit";
import List from "./components/list";
import "./index.css";
import { Outlet } from "react-router-dom";

//去json資料庫拿東西出來
async function fetchDataset(setDataset) {
  const res = await fetch(api_get_data_newSet);
  const { dataset } = await res.json();
  setDataset(dataset);
  console.log(dataset);
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

async function fetchSymptoms(setSymptoms) {
  const res = await fetch(api_get_symptoms);
  const { symptoms } = await res.json();
  setSymptoms(symptoms);
}

async function putSymptoms(symptoms) {
  await fetch(api_get_symptoms, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ symptoms }),
  });
}

const NewDataset = () => {
  //定義一個react偵測到有變動時要渲染的東西
  const [dataset, setDataset] = useState([]);//要新增的資料集
  const [symptoms, setSymptoms] = useState([]);//病徵
  const submittingState = useRef(false);//資料集
  const submittingState1 = useRef(false);//病徵

  //當頁面刷新的時候會自動執行下方兩個useEffect
  //定義有變動時要做的動作
  useEffect(() => {
    //dataset有變動時，存資料到json
    console.log(submittingState);
    if (!submittingState.current) {
      //但是當畫面初始化的時候不要把空資料夾更新到json
      return;
    }
    putDataset(dataset)
    .then((dataset) => (submittingState.current = false)); //要更新json的時候，更改狀態，更新好後再把狀態改回來
  }, [dataset]);
  
  useEffect(() => {
    console.log(submittingState1);
    //symptoms有變動時，存資料到json
    if (!submittingState1.current) {
      //但是當畫面初始化的時候不要把空資料夾更新到json
      return;
    }
    putSymptoms(symptoms)
    .then((symptoms) => (submittingState1.current = false)); //要更新json的時候，更改狀態，更新好後再把狀態改回來
  }, [symptoms]);

  useEffect(() => {
    //網頁開啟時，從json取資料
    fetchDataset(setDataset);
    fetchSymptoms(setSymptoms);
  }, []);

  return (
    <div className="app">
      <Edit
        add={setDataset}
        symptomsAdd={setSymptoms} 
        submittingState={submittingState}
        submittingState1={submittingState1}
        dataset={dataset} 
        arraySymptoms={symptoms} 
      />
      <List
        listSymptoms={symptoms}
        listDelete={setSymptoms}
        submittingState1={submittingState1}
      />
      <Outlet />
    </div>
  );
};

export default NewDataset;
