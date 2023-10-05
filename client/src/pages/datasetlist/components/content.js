//套件
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
//檔案
// import { AuthContext } from "../../../helpers/AuthContext";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const Content = ({dataset}) => {
  // const { userEmail } = useContext(AuthContext);
  // const { userOrg } = useContext(AuthContext);
  const[ result, setResult ] = useState([]);
  const [ name, setName ] = useState(dataset.name); //資料集名稱(英)
  const [ notes, setNotes ] = useState(dataset.notes); //資料集notes
  const [ title, setTitle ] = useState(dataset.title); //資料集名稱(中)
  const [ maintainer_email, setMaintainer_email ] = useState(dataset.title);  //資料集管理者
  var [ orgName, setOrgName ] = useState();
  var [ packageDataInfo, setPackageDataInfo ] = useState([]);
  var [ files, setFiles ] = useState([]);
  var [ org_title, setOrg_title ] = useState();
  var [ org_id, setOrg_id] = useState();
  var [ org_image_url, setOrg_image_url ] = useState();

  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`,
              {params:{datasetName:name},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          packageDataInfo = response.data;
          setPackageDataInfo(packageDataInfo);
          //以下為破解拿不到孫子的怪寫法
          org_id=packageDataInfo.organization.id;
          setOrg_id(org_id);
          org_title=packageDataInfo.organization.title;
          setOrg_title(org_title);
          files=packageDataInfo.resources;
          setFiles(files);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },[name])
  useEffect(() => {
    const getOrg = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`,
              {params:{id:org_id},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          // console.log(org_id);
          if(response.data.image_display_url!==""){
            org_image_url=response.data.image_display_url;
            setOrg_image_url(org_image_url);
          }else{
            org_image_url="./undefined_url.svg";
            setOrg_image_url(org_image_url);
          }
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(org_id!==undefined){
      getOrg();
    }
  },[org_id])

  return (
    <>
    <div className="list_content">
      {/* {userEmail === maintainer_email ? (
        <Link to={`datasetInfo/${name}`} className="link">{title}</Link> //回傳管理者介面
      ) : (
        <Link to={`datasetInfoU/${name}`} className="link">{title}</Link>  //回傳使用者介面
      )} */}
      <div className="org_container">
        <div className="org_url">
          <img src={`${org_image_url}`} className="image_url"></img>
        </div>
        <div className="org-title-font-style">
          <font className="org-title-font-style">{org_title}</font>
        </div>
      </div>
      <Link to={`datasetInfo/${name}`} className="link" title={`/datasetInfo/${name}`}>{title}</Link>
      <font className="package-list-org-font-style">{name}</font>
      <div className="p">{notes}</div>
      <div className="package-card-footer-style">
        <div className="AttachFileIcon-style">
          <AttachFileIcon></AttachFileIcon>{files.length}件
        </div>
        <Link to={`datasetInfo/${name}`} className="link-to-dataInfo" title={`/datasetInfo/${name}`}>More...</Link>
      </div>
    </div>
    </>
  );
};
export default Content;