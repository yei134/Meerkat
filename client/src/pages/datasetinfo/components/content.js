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
var groups=[];
var files=[];
var filesName=[];
var groupsName=[];

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
        console.log(packageDataInfo);
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show`,
          {params:{datasetName:datasetName}})
        .then(response => {
          console.log(response);
          packageDataInfo = response.data.result;
          setPackageDataInfo(packageDataInfo);
          ownerOrg = packageDataInfo.organization.title;
          files=packageDataInfo.resources.map((resource)=>resource.name);
          groups=packageDataInfo.groups.map((name)=>name);
          // for(var i=0; i<=files.length; i++){
          //   filesName = files[i].name;
          //   console.log(filesName)
          // }
          // for(var i=0; i<=groups.length; i++){
          //   groupsName = groups[i].name;
          // }
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },[])
  console.log(packageDataInfo);
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
        groupsName = {groupsName}
        ownerOrg = {ownerOrg}
        author = {author}
        createTime={createTime}
        modifiedTime={modifiedTime}
      />
      <ConRight
        key={notes}
        notes = {notes}
        title = {title}
        files = {files}
        name = {datasetName}
      />
    </div>
  );
}

export default Content;