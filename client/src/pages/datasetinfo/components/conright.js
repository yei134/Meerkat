import React from "react";
import "../index.css";
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
//notes, symptoms, title
const ConRight = ({notes, symptoms, title, files, name}) => {
  return (
    <div>
      <p className="p">
        <EmojiFlagsIcon />
        <a href="/">資料集列表</a>
        /
        <a href={`/datasetInfo/${name}`} className="page">{title}</a>
      </p>
      <div className="conright">
        <h2>{title}</h2>
        <div className="note">{notes}</div>
        <hr></hr>
        <div className="flex-container">
          <div className="dataleft">
            <h3 className="h3">DICOM索引檔</h3>
            <a href="google.com">{symptoms}</a><br/>
            <h6 className="h6">*需下載者請先提出申請文件</h6>
          </div>
          <div className="dataright">
            <h3 className="h3">其餘附加檔案</h3>
            <div>
              {
                files.map((item)=>{
                  return(
                    <li key={item}>
                      {item}
                    </li>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConRight;