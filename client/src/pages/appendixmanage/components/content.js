import React from "react";
import ConRight from "./conright";
import ConLeft from "./conleft";
import axios from 'axios';
import { useState, useEffect, useRef } from "react";

var ownerOrg = "";
// var groups=["app"];
//取得資料集
const Content = ({ datasetName, selectedItems, setSelectedItems ,fileUploadCount }) => {
  // const [symptoms, setSymptoms]=useState([]); //resources.name 病徵名稱
  var [packageDataInfo, setPackageDataInfo] = useState([]);
  const [ name, setName ] = useState();
  const [ author, setAuthor ] = useState();
  const [ maintainer, setMaintainer ] = useState();
  const [ notes, setNotes ] = useState();
  const [ title, setTitle ] = useState();
  var [ tags, setTags ] = useState();
  var [ organization, setOrganization ] = useState();
  const [ createTime, setCreateTime ] = useState();
  const [ modifiedTime, setModifiedTime ] = useState();
  const [ datasetEmail, setDatasetEmail ] = useState();
  const [ groups, setGroups ] = useState();
  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`,
          {params:{datasetName:datasetName},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}})
          .then(response => {
            packageDataInfo = response.data;
            setPackageDataInfo(packageDataInfo);
          })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },
   [fileUploadCount])
   useEffect(() => {
    const getData = () => {
      setName(packageDataInfo.name);
      setTitle(packageDataInfo.title);
      setAuthor(packageDataInfo.author);
      setMaintainer(packageDataInfo.maintainer);
      setNotes(packageDataInfo.notes);
      
      setCreateTime(packageDataInfo.metadata_created);
      setModifiedTime(packageDataInfo.metadata_modified);
      setDatasetEmail(packageDataInfo.maintainer_email);
      console.log(tags);
    }
    getData();
  },[packageDataInfo])
  // console.log(packageDataInfo);
  const { resources } = packageDataInfo;
  return (
    <div className="contentContainer">
      <ConRight resources={resources} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
      <ConLeft key={datasetName }
        name={datasetName}
        title={title}
        ownerOrg = {organization}
        maintainer={maintainer}
        author = {author}
        createTime={createTime}
        modifiedTime={modifiedTime}
        notes = {notes}
        tags = {tags}
      />
    </div>
  );
}
export default Content;