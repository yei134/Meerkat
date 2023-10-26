//套件
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//檔案
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content";

function DatasetInfo() {
  const datasetNameId = useParams(); //從路徑拿取datasetName
  const datasetName = datasetNameId.getId;
  const [packageDataInfo, setPackageDataInfo] = useState([]);
  const [author, setAuthor] = useState();
  const [maintainer, setMaintainer] = useState();
  const [notes, setNotes] = useState();
  const [title, setTitle] = useState();
  const [tags, setTags] = useState();
  const [organization_title, setOrganization_title] = useState();
  const [organization_id, setOrganization_id] = useState();
  const [createTime, setCreateTime] = useState();
  const [modifiedTime, setModifiedTime] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, { params: { datasetName: datasetName }, headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } })
          .then((res) => {
            const tmp = res.data;
            setPackageDataInfo(tmp);
            setOrganization_title(tmp.organization.title);
            setOrganization_id(tmp.organization.id);
            setFiles(tmp.resources);
            setTags(tmp.tags);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getDataset();
  }, []);
  useEffect(() => {
    const getData = () => {
      setTitle(packageDataInfo.title);
      setAuthor(packageDataInfo.author);
      setMaintainer(packageDataInfo.maintainer);
      setNotes(packageDataInfo.notes);
      setCreateTime(packageDataInfo.metadata_created);
      setModifiedTime(packageDataInfo.metadata_modified);
    };
    getData();
  }, [packageDataInfo]);

  return (
    <Content
      key={datasetName}
      datasetName={datasetName}
      title={title}
      // groupsName = {groups}
      org_title={organization_title}
      org_id={organization_id}
      maintainer={maintainer}
      author={author}
      createTime={createTime}
      modifiedTime={modifiedTime}
      notes={notes}
      files={files}
      tags={tags}
      // listSymptoms={symptoms}
    />
  );
}
export default DatasetInfo;
