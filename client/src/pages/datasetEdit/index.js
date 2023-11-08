//套件
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Outlet } from "react-router-dom";
import Content from "./components/content";

function DatasetEdit(){
  const datasetNameId=useParams();  //從路徑拿取datasetName
  const datasetName = datasetNameId.getId;
  console.log(typeof(datasetName))
  return(
    <>
      <Content
        key={datasetNameId}
        datasetName={datasetName}
      />
      <Outlet/>
    </>
  )
}
export default DatasetEdit;