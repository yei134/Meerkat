//套件
import React, { useEffect, useState } from "react";
import axios from 'axios';
//檔案
// import List from "./list";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

const Content = ({dataset}) => {
  const[result, setResult]=useState([]);
  useEffect(()=>{
    axios.get(
      `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`,
      {params:{datasetName:dataset},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
      // `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show?datasetName=${dataset}`
      )
      .then(response=>setResult(response.data))
      // .then(response=>console.log(response.data.result))
      .catch(error=>console.log(error));
  },[])
  return (
    <>
      <Link to={`datasetInfo/${dataset}`} className="link">{result.title}</Link>
      <p className="p">{result.notes}</p>
      <hr></hr>
    </>
  );
};
export default Content;