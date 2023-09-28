import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from 'axios';
import Item from "./Item";
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';


function Content({ uploadFile, setUploadFile, setstatus ,datasetName}) {
  var [packageDataInfo, setPackageDataInfo]=useState([]);
  useEffect(() => {
    const getDataset = async () => {
      try {
        console.log(packageDataInfo);
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}ckan_get/package_show`,
          {params:{datasetName:datasetName}})
        .then(response => {
          console.log(response);
          packageDataInfo = response.data.result;
          setPackageDataInfo(packageDataInfo);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },[])

  var title=packageDataInfo.title;

  return (
    <div>
      <p className="p">
        <EmojiFlagsIcon />
        <a href="/">資料集列表</a>
        <text> / </text>
        <a href={`/datasetInfo/${datasetName}`}>{title}</a>
        <text> / </text>
        <a href={`/datasetInfo/${datasetName}/fileUpload`} className="page">{title}上傳區</a>
      </p>
      <table>
        <thead>
          <tr>
            <th>NO.</th>
            <th>FileName</th>
            <th>Status</th>
            <th>Processing Progress</th>
            <th>FileSize</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {uploadFile.map((item, index) => {
            const { id, fileName, fileStatus, processingProgress, fileSize } =
              item;
            return (
              <Item
                key={id}
                id={id}
                number={index + 1}
                fileName={fileName}
                fileStatus={fileStatus}
                processingProgress={processingProgress}
                fileSize={(fileSize /(1024*1024)).toFixed(1) + "MB"}
                setUploadFile={setUploadFile} //如果需要刪除項目時需要的
                setstatus={setstatus}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Content;