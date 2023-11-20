// import { useState, useEffectREADYuploadDiocomFile, useRef } from "react";
import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
//多檔案上傳參考:https://ithelp.ithome.com.tw/articles/10269464
//js基本操作:https://ithelp.ithome.com.tw/articles/10274961
function ActionBotton({ datasetName, setUploadFile, deletealldata, status, uploadFile, symptomId, symptom }) {
  var time = Date(); //取得現在時間
  time = time.split(" "); //將取得的值用空白分割
  time = time[3] + "-" + time[1] + "-" + time[2] + " " + time[4]; //取出分割後需要的部分
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getDataset = async () => {
      console.log(datasetName);
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, {
            params: { datasetName: datasetName },
            headers: {
              Authorization: process.env.REACT_APP_CKAN_TOKEN,
            },
          })
          .then((res) => {
            const pInfo = res.data;
            setTitle(pInfo.title);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getDataset();
  }, []);
  function status() {
    console.log(uploadFile);
    setUploadFile(function (prev) {
      const newUploadFile = uploadFile.map((item) => {
        const formData = new FormData();
        formData.append("id", symptomId);
        formData.append("dicomFile", item.dicomFile);
        formData.append("description", symptomId);
        if (formData !== undefined) {
          axios
            .post(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studiesAppend`, formData, {
              headers: {
                Authorization: process.env.REACT_APP_CKAN_TOKEN,
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.status === 200) {
                setUploadFile((prev) => {
                  // 取出當前處理的資料
                  let change = prev.filter((file) => file.id === item.id)[0];
                  // 更改狀態
                  change.fileStatus = "SUCCESS";
                  // 取出非處理資料
                  const prev_filter = prev.filter((file) => file.id !== item.id);
                  return [...prev_filter, change];
                });
              } else {
                alert(item.fileName + "上傳失敗");
              }
            })
            .catch((error) => {
              console.error(error);
              alert(item.fileName + "上傳失敗");
            });
        }
        return item;
      });
      return newUploadFile;
    });
  }
  function deleteall() {
    deletealldata([]);
  }
  function add(event) {
    const files = event.target.files;
    for (let element of files) {
      const uploadFileName = uploadFile.map((item) => item.fileName);
      if (uploadFileName.includes(element.name)) {
        alert(element.name + "檔案已存在");
      } else {
        setUploadFile(function (prev) {
          return [
            {
              dicomFile: element,
              id: v4(),
              fileName: element.name,
              fileStatus: "READY",
              processingProgress: time,
              fileSize: element.size,
            },
            ...prev,
          ];
        });
      }
      event.value = {};
    }
  }
  return (
    <div className="flex-container-row">
      <div className="route">
        <HomeIcon />
        <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>/<a href={`/datasetInfo/${datasetName}`}>&nbsp;&nbsp;{title}&nbsp;&nbsp;</a>/
        <a href={`/datasetInfo/${datasetName}/dicomManage`}>&nbsp;&nbsp;{title}&nbsp;dicom列表&nbsp;&nbsp;</a>/
        <a href={`/datasetInfo/${datasetName}/fileUpload/${symptom}/${symptomId}`} className="page">
          &nbsp;&nbsp;{symptom}上傳區
        </a>
      </div>
      {/* className="upload" */}
      <label htmlFor="filenp">
        <input type="file" id="filenp" onChange={add} accept=".dcm" multiple={true} />
        <span className="btnFile">
          <InsertDriveFileIcon />
          Select Files
        </span>
      </label>
      <label htmlFor="filep">
        <input type="file" id="filep" webkitdirectory="true" onChange={add} accept=".dcm" multiple={true} />
        <span className="btnFile">
          <FolderIcon />
          Select Folders
        </span>
      </label>
      <span />
      <span onClick={deleteall} className="btnFile">
        <DeleteIcon />
        Reset
      </span>
      <span onClick={status} className="btnFile">
        <UploadIcon />
        Upload
      </span>
    </div>
  );
}
export default ActionBotton;
