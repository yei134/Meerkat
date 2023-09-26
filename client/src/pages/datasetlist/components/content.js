//套件
import React, { useState, useEffect, useContext } from "react";
//檔案
// import List from "./list";
import { AuthContext } from "../../../helpers/AuthContext";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

const Content = ({dataset}) => {
  const { userEmail } = useContext(AuthContext);
  const { userOrg } = useContext(AuthContext);
  const[ result, setResult ] = useState([]);
  const [ name, setName ] = useState(dataset.name); //資料集名稱(英)
  const [ notes, setNotes ] = useState(dataset.notes); //資料集notes
  const [ title, setTitle ] = useState(dataset.title); //資料集名稱(中)
  const [ maintainer_email, setMaintainer_email ] = useState(dataset.title);  //資料集管理者
  console.log(dataset);
  return (
    <>
      {userEmail === maintainer_email ? (
        <Link to={`datasetInfo/${name}`} className="link">{title}</Link> //回傳管理者介面
      ) : (
        <Link to={`datasetInfoU/${name}`} className="link">{title}</Link>  //回傳使用者介面
      )}
      <p className="p">{notes}</p>
      <hr></hr>
    </>
  );
};
export default Content;