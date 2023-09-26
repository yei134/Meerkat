//套件
import React, { Component, useEffect, useState } from "react";
import axios from "axios";
//檔案
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router-dom";
// import { ckan_test_1 } from "../../global/constants";

function DatasetList() {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJFUnI3MkpHUmdBaUt3T0FsdE5JeVhRNGUyUS1kSTAyX2J1VXFNZFNsZkJVdTNidlBvT3lXWUVWV0IyeTN1TUhSSUlvVWNaelNlVE96aVVYYyIsImlhdCI6MTY4MzE5OTA1MH0.LK0VQp8BmR_wzF5p-jAnkvX_IQVqPajeM-zM7USsvv4";
  const [list, setList] = useState([]);

  useEffect(() => {
    // axios.get(`${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_search`,
    console.log(
      `src/pages/datasetlist/index.js backendURI: ${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_search`
    );
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_search`, {
        params: {
          limit: 20,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setList(response.data.result.results);
        if (response.data.result.results != null) {
          console.log(list);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(list.id);
  return (
    <>
      {/* <div className="head">
        <Header />
      </div> */}
      {/* <Navbar /> */}
      {/* <div>
        <></>
      </div> */}
      <div className="list_content">
        {list.map((element) => {
          return <Content dataset={element} key={element.id} />;
        })}
      </div>
      {/* <Outlet /> */}
    </>
  );
}

export default DatasetList;
