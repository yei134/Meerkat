//sz
import { useState, useEffect, useRef } from "react";
import { api_get_data_newSet } from"../../../global/constants";
import { api_get_symptoms } from "../../../global/constants";
import axios from 'axios';
import React from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";

var ownerOrg="";
// var groups=["app"];
var groups="";

const Content = ({datasetName}) => {
  // const [symptoms, setSymptoms]=useState([]); //resources.name 病徵名稱
  var [packageDataInfo, setPackageDataInfo]=useState([]);
  useEffect(() => {
    const getDataset = async () => {
      try {
        // const response = await axios.get( 
        //   `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show`,
        //   {params:{datasetName:datasetName}});
        // packageDataInfo = response.data.result;
        // setPackageDataInfo(packageDataInfo);
        // console.log(packageDataInfo);
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`,
          {params:{datasetName:datasetName},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}})
        .then(response => {
          packageDataInfo = response.data;
          setPackageDataInfo(packageDataInfo);
          ownerOrg = packageDataInfo.organization.title;
          // if(packageDataInfo.groups.length>=1){
          //   for(var i=0; i<=packageDataInfo.groups.length; i++){
          //     groups = packageDataInfo.groups[i].title; //待改
          //   }
          // }else{
          //   groups = null;
          // }
          // console.log(packageDataInfo.groups[0].title);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },[])
  console.log(packageDataInfo);
  console.log()
  var author = packageDataInfo.author;
  var notes = packageDataInfo.notes;
  var title = packageDataInfo.title;
  var createTime = packageDataInfo.metadata_created;
  var modifiedTime = packageDataInfo.metadata_modified;

  return (
    <div className="flex-container">
      <ConLeft
        key={datasetName}
        name = {datasetName}
        title = {title}
        groups = {groups}
        ownerOrg = {ownerOrg}
        author = {author}
        createTime={createTime}
        modifiedTime={modifiedTime}
      />
      <ConRight
        key={notes}
        notes = {notes}
        title = {title}
      />
    </div>
  );
}

export default Content;