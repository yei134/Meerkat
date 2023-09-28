import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content";
import { AuthContext } from "../../helpers/AuthContext";

var ownerOrg="";
// var groups=["app"];
var groups=[];
var files=[];
var filesName=[];
var groupsName=[];



function DatasetInfo(){
  const token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJFUnI3MkpHUmdBaUt3T0FsdE5JeVhRNGUyUS1kSTAyX2J1VXFNZFNsZkJVdTNidlBvT3lXWUVWV0IyeTN1TUhSSUlvVWNaelNlVE96aVVYYyIsImlhdCI6MTY4MzE5OTA1MH0.LK0VQp8BmR_wzF5p-jAnkvX_IQVqPajeM-zM7USsvv4";
  const navigate = useNavigate();
  const { userEmail } = useContext(AuthContext);
  const { userOrg } = useContext(AuthContext);
  const datasetNameId=useParams();  //從路徑拿取datasetName
  const datasetName = datasetNameId.getId;
  const [ packageDataInfo, setPackageDataInfo ] = useState([]);
  const [ name, setName ] = useState();
  const [ author, setAuthor ] = useState();
  const [ notes, setNotes ] = useState();
  const [ title, setTitle ] = useState();
  var org=[];
  const [ organization, setOrganization ] = useState()
  const [ createTime, setCreateTime ] = useState();
  const [ modifiedTime, setModifiedTime ] = useState();
  const [ datasetEmail, setDatasetEmail ] = useState();
  const [ groups, setGroups ] = useState();
  const [ files, setFiles ] = useState([]);

  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_show`,
              {params:{datasetName:datasetName},headers:{'Authorization': token}}
        )
        .then(response => {
          console.log(response);
          setPackageDataInfo(response.data.result);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },[])
  useEffect(() => {
    const getData = () => {
      setName(packageDataInfo.name);
      setTitle(packageDataInfo.title);
      setAuthor(packageDataInfo.author);
      setNotes(packageDataInfo.notes);
      org = packageDataInfo.organization;
      // setOrganization(packageDataInfo.organization);
      setCreateTime(packageDataInfo.metadata_created);
      setModifiedTime(packageDataInfo.metadata_modified);
      setDatasetEmail(packageDataInfo.maintainer_email);
      // setFiles(packageDataInfo.resources.map((resource)=>resource.name));
      // setGroups(packageDataInfo.groups.map((name)=>name));
    }
    getData();
  },[packageDataInfo])

  console.log(packageDataInfo);
  console.log(files);

if (userEmail !== datasetEmail) {
    navigate("/");
    return null;
  }else{
    return(
      <>
        <Header
          datasetName={datasetName}
        />
        <Content
          key={datasetName}
          datasetName = {datasetName}
          title = {title}
          // groupsName = {groups}
          ownerOrg = {organization}
          author = {author}
          createTime={createTime}
          modifiedTime={modifiedTime}
          notes = {notes}
          files = {files}
          // listSymptoms={symptoms}
        />
      </>
    );;
  }
}
export default DatasetInfo;