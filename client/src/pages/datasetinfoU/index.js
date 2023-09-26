import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content";
import { AuthContext } from "../../helpers/AuthContext";

var ownerOrg="";
// var groups=["app"];

function DatasetInfo(){
  // ckan token
  const token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJFUnI3MkpHUmdBaUt3T0FsdE5JeVhRNGUyUS1kSTAyX2J1VXFNZFNsZkJVdTNidlBvT3lXWUVWV0IyeTN1TUhSSUlvVWNaelNlVE96aVVYYyIsImlhdCI6MTY4MzE5OTA1MH0.LK0VQp8BmR_wzF5p-jAnkvX_IQVqPajeM-zM7USsvv4";
  // 判斷是否為管理者 否的話跳轉回list
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
  const [ orgData, setOrgData ] = useState([]);
  const [ createTime, setCreateTime ] = useState();
  const [ modifiedTime, setModifiedTime ] = useState();
  const [ datasetEmail, setDatasetEmail ] = useState();
  const [ groups, setGroups ] = useState();
  const [ files, setFiles ] = useState([]);       // 所有的檔案
  const [ index, setIndex ] = useState([]);       // 索引檔
  const [ appendix, setAppendix ] = useState([]); // 附件檔
  // test area
  const [test,setTest] = useState({});
  var firstRender = 0;

  async function getDatasetInfo() {
    axios.get(
      `${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_show`,
      {params:{datasetName:datasetName},headers:{'Authorization': token}})
      .then(res=>setTest(res.data.result))
      .catch(e=>console.log(e))
  }
  useEffect(()=>{
    if (!firstRender) {
      getDatasetInfo();
    }
  },[])
  // useEffect(async() => {
  //   const getDataset = async () => {
  //     try {
  //       await axios.get( 
  //         `${process.env.REACT_APP_BACKEND_URI}ckanAPI/package_show`,
  //             {params:{datasetName:datasetName},headers:{'Authorization': token}}
  //       )
  //       .then(response => {
  //         console.log(response);
  //         setPackageDataInfo(response.data.result);
  //       })
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   getDataset();
  // },[])
  useEffect(() => {
    const getData = () => {
      setName(packageDataInfo.name);
      setTitle(packageDataInfo.title);
      setAuthor(packageDataInfo.author);
      setNotes(packageDataInfo.notes);
      setOrgData(packageDataInfo.organization);
      // setOrganization(packageDataInfo.organization);
      setCreateTime(packageDataInfo.metadata_created);
      setModifiedTime(packageDataInfo.metadata_modified);
      setDatasetEmail(packageDataInfo.maintainer_email);
      // setFiles(packageDataInfo.resources.map((resource)=>resource.name));
      // setGroups(packageDataInfo.groups.map((name)=>name));
    }
    getData();
    console.log(packageDataInfo);
  },[packageDataInfo])


  if (userEmail !== datasetEmail) {
    return(
      <>
        {/* <Header
          datasetName={datasetName}
        /> */}
        {/* <Content
          key={datasetName}
          datasetName = {datasetName}
          title = {title}
          // groupsName = {groups}
          orgData = {orgData}
          author = {author}
          createTime={createTime}
          modifiedTime={modifiedTime}
          notes = {notes}
          files = {files}
          // listSymptoms={symptoms}
        /> */}
      </>
    );
  }else{
    return null;
  }
}
export default DatasetInfo;