//套件
import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
//檔案
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content";
import Condition from "./components/condition";
// import Navbar from "../../components/Navbar"
//icon庫
import TextField from "@mui/material/TextField";

export default function DatasetList() {
  const [list, setList] = useState([]);
  const [inputText, setInputText] = useState("");

  //=== package_search讀資料, 依searchQuery去找符合關鍵詞的資料 ===//
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_search`, {
        params: {
          limit: 20,
          searchQuery: inputText,
        },
        headers: {
          Authorization: process.env.REACT_APP_CKAN_TOKEN,
        },
      })
      .then((response) => {
        setList(response.data.results);
        if (response.data.result != null) {
          console.log(list);
        }
      })
      .catch((error) => console.log(error));
  }, [inputText]);
  //=== 監聽SearchBar ===//
  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  return (
    <>
      {/* 頁首 */}
      {/* <div className="head">
        <Header/>
      </div> */}
      <div className="search">
        <TextField id="outlined-basic" onChange={inputHandler} variant="outlined" fullWidth label="輸入關鍵詞" />
      </div>
      {/* Body */}
      <div className="package-condition-div-style">
        <Condition inputText={inputText} setInputText={setInputText} />
      </div>
      <Outlet />
    </>
  );
}
