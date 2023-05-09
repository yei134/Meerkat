//套件
import React, {Component, useEffect, useState} from "react";
import axios from 'axios';
//檔案
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content"
// import { ckan_test_1 } from "../../global/constants";

function DatasetList() {
  const[list,setList]=useState([])
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URI}ckan_get/package_list`)
      .then(response=>setList(response.data.result))
      .catch(error=>console.log(error));
  },[])
  return(
    <>
      <Header/>
      {
        list.map((element)=>{
          return(<Content dataset={element} key={element}/>)
        })
      }
    </>
  )
}

export default DatasetList;