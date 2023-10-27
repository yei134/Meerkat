//套件
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
//檔案
import "./index.css";
import Condition from "./components/condition";
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
      })
      .catch((error) => console.error(error));
  }, [inputText]);
  //=== 監聽SearchBar ===//
  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  return (
    <>
      <div className="search">
        <TextField id="outlined-basic" onChange={inputHandler} variant="outlined" fullWidth size="small" label="輸入關鍵詞" sx={{ fontSize: "0.2rem" }}/>
      </div>
      {/* Body */}
      <div className="package-condition-div-style">
        <Condition inputText={inputText} setInputText={setInputText} />
      </div>
      <Outlet />
    </>
  );
}
