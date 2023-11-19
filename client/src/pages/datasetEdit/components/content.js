import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import ConLeft from "./conLeft";
import ActionButton from "./actionButton";
import "../index.css";
import EditIcon from "@mui/icons-material/Edit";

const Content = ({ datasetName }) => {
  var [datasetInfo, setDatasetInfo] = useState();
  const [title, setTitle] = useState();
  const [id, setId] = useState();
  const [author, setAuthor] = useState();
  const [author_email, setAuthor_email] = useState();
  const [maintainer, setMaintainer] = useState();
  const [maintainer_email, setMaintainer_email] = useState();
  const [notes, setNotes] = useState();
  const [owner_org, setOwner_org] = useState();
  const [groups, setgroups] = useState();

  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, { params: { datasetName: datasetName }, headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } })
          .then((response) => {
            console.log(response.data);
            datasetInfo = response.data;
            setDatasetInfo(datasetInfo);
            console.log(datasetInfo);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getDataset();
  }, []);

  useEffect(() => {
    if (datasetInfo !== undefined) {
      setTitle(datasetInfo.title);
      setId(datasetInfo.name);
      setAuthor(datasetInfo.author);
      setAuthor_email(datasetInfo.author_email);
      setMaintainer(datasetInfo.maintainer);
      setMaintainer_email(datasetInfo.maintainer_email);
      setNotes(datasetInfo.notes);
      setOwner_org(datasetInfo.owner_org);
      setgroups(datasetInfo.groups);
    }
  }, [datasetInfo]);
  function handleTitleChange(e) {
    setTitle(e.target.value);
  }
  function handleAuthorChange(e) {
    setAuthor(e.target.value);
  }
  function handleAuthor_emailChange(e) {
    setAuthor_email(e.target.value);
  }
  function handleMaintainerChange(e) {
    setMaintainer(e.target.value);
  }
  function handleMantainer_emailChange(e) {
    setMaintainer_email(e.target.value);
  }
  function handleNotesChange(e) {
    setNotes(e.target.value);
  }
  return (
    <div className="edit-flex-container">
      <ConLeft owner_org={owner_org} datasetTitle={title} groups={groups} datasetName={datasetName} />
      <div className="form-container">
        <div>
          <span className="edit-title-style">
            <EditIcon />
            &nbsp;Modify&nbsp;Dataset&nbsp;Information
          </span>
          <hr />
        </div>
        <form>
          <div>
            <span>Id：</span>
            <input value={id} disabled className="form-input-style"></input>
          </div>
          <div>
            <span>
              &nbsp;Title：<font className="edit-must-fill">&#8251;必填</font>
            </span>
            <input value={title} onChange={handleTitleChange} className="form-input-style"></input>
          </div>
          <div>
            <span>Author：</span>
            <input value={author} onChange={handleAuthorChange} className="form-input-style"></input>
          </div>
          <div>
            <span>Author E-mail：</span>
            <input value={author_email} onChange={handleAuthor_emailChange} className="form-input-style"></input>
          </div>
          <div>
            <span>
              Mantainer：<font className="edit-must-fill">&#8251;必填</font>
            </span>
            <input value={maintainer} onChange={handleMaintainerChange} className="form-input-style"></input>
          </div>
          <div>
            <span>
              Mantainer E-mail：<font className="edit-must-fill">&#8251;必填</font>
            </span>
            <input value={maintainer_email} onChange={handleMantainer_emailChange} className="form-input-style"></input>
          </div>
          <div>
            <span>Description：</span>
            <textarea value={notes} onChange={handleNotesChange} className="form-input-style"></textarea>
          </div>
        </form>
        <ActionButton title={title} id={id} author={author} author_email={author_email} maintainer={maintainer} maintainer_email={maintainer_email} notes={notes} datasetName={datasetName} />
      </div>
    </div>
  );
};
export default Content;
