//套件
import React, { useEffect, useState } from "react";
import axios from 'axios';
//檔案

const Content = ({dataset}) => {
  const [notes,setNotes]=useState([]);
  useEffect(()=>{
    axios.get(
      `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show`,
      {params:{datasetName:dataset}}
      // `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show?datasetName=${dataset}`
      )
      .then(response=>setNotes(response.data.result.notes))
      .then(error=>console.log(error));
  },[])
  return (
    <>
      <a href="/datasetInfo">{dataset}</a>
      <p>{notes}</p>
      <hr/>
    </>
  );
};

export default Content;