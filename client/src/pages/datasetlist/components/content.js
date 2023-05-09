//套件
import React, { useEffect, useState } from "react";
import axios from 'axios';
//檔案
import List from "./list";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

const Content = ({dataset}) => {
  const[notes, setNotes]=useState([]);
  useEffect(()=>{
    axios.get(
      `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show`,
      {params:{datasetName:dataset}}
      // `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show?datasetName=${dataset}`
      )
      .then(response=>setNotes(response.data.result.notes))
      // .then(response=>console.log(response.data.result))
      .catch(error=>console.log(error));
  },[])
  return (
    <>
      <Link to={`datasetInfo?id=${dataset}`}>{dataset}</Link>
      <p>{notes}</p>
    </>
  );
};
export default Content;

// export default function Content(){
//   dataset = useLoaderData();
// }