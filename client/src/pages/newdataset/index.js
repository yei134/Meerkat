//資料集新增頁面
import { useState, useEffect, useRef } from "react";
import Edit from "./components/edit";
import List from "./components/list";
import "./index.css";
import { Outlet } from "react-router-dom";
import Header from "./components/header";

const NewDataset = () => {
  //定義一個react偵測到有變動時要渲染的東西
  const [dataset, setDataset] = useState([]);//要新增的資料集
  const [symptoms, setSymptoms] = useState([]);//病徵
  const submittingState = useRef(false);//資料集
  const submittingState1 = useRef(false);//病徵

  //當頁面刷新的時候會自動執行下方兩個useEffect
  //定義有變動時要做的動作
  useEffect(() => {
    
  }, []);

  return (
    <div className="new_basic">
      <Header/>
      <div className="new_content">
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
    </div>
  );
};

export default NewDataset;