import React, { useEffect, useState } from "react";
import Linkify from "linkify-react"; //判斷字串是否含超連結
import ItemLeft from "./itemLeft";
import ItemRight from "./itemRight";
import "../index.css";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AttachFileIcon from "@mui/icons-material/AttachFile";
const ConRight = ({ notes, title, files, name }) => {
  var [indexFiles, setIndexFiles] = useState([]);
  var [appendix, setAppendix] = useState([]);
  useEffect(() => {
    const keywords = "_[type]_"; //辨別[索引檔]和[附件檔]的關鍵詞
    indexFiles = files.filter((item) => {
      return typeof item.name === "string" && item.name.includes(keywords);
    }); // indexFiles => [索引檔]
    setIndexFiles(indexFiles);
    appendix = files.filter((item) => {
      return typeof item.name === "string" && !item.name.includes(keywords);
    }); // appendix => [附件檔]
    setAppendix(appendix);
  }, [files]);

  return (
    <div>
      <div className="route-container">
        <div className="route">
          <HomeIcon />
          <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>/
          <a href={`/datasetInfo/${name}`} className="page">
            &nbsp;&nbsp;{title}
          </a>
        </div>
        <button className="edit-icon-button">
          <a href={`/datasetInfo/${name}/dicomManage`}>
            <PsychologyIcon />
          </a>
        </button>
        <button className="edit-icon-button">
          <a href={`/datasetInfo/${name}/appendixmanage`}>
            <AttachFileIcon />
          </a>
        </button>
        <button className="edit-icon-button">
          <a href={`/datasetInfo/${name}/datasetEdit`}>
            <SettingsIcon />
          </a>
        </button>
      </div>
      <div>
        <div className="conright">
          <font className="font-package-title">{title}</font>
          <Linkify as="div" className="note">
            {notes}
          </Linkify>
        </div>
        <div className="file-container">
          <div className="dataleft">
            <div className="float-left">
              <font className="conright-file-title">DICOM索引檔</font>
            </div>
            <hr className="file-hr-style" />
            {indexFiles.map((element) => {
              return <ItemLeft key={element.id} name={element.name} format={element.format} last_modified={element.last_modified} url={element.url} />;
            })}
          </div>
          <div className="dataright">
            <div className="float-left">
              <font className="conright-file-title">其餘附加檔案</font>
            </div>
            <hr className="file-hr-style" />
            {appendix.map((element) => {
              return <ItemRight key={element.id} name={element.name} format={element.format} last_modified={element.last_modified} url={element.url} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConRight;
