import { useState, useEffect, useRef } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
const Item = ({ id, number, fileName, fileStatus, processingProgress, fileSize, setUploadFile, uploadFile, symptomId }) => {
  const [uploadDiocomFile, setUploadDiocomFile] = useState({});

  useEffect(() => {
    console.log(uploadFile);
  }, [uploadFile]);
  function deleteItem() {
    setUploadFile((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  }
  function uploadItem() {
    console.log(symptomId);
    setUploadFile(function (prev) {
      const newUploadFile = prev.map((item) => {
        if (item.id === id) {
          console.log(item);
          console.log(item.dicomFile);
          const formData = new FormData();
          formData.append("id", symptomId);
          formData.append("dicomFile", item.dicomFile);
          formData.append("description", symptomId);
          if (formData !== undefined) {
            const res = axios
              .post(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studiesAppend`, formData, {
                headers: {
                  Authorization: process.env.REACT_APP_CKAN_TOKEN,
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                alert(item.fileName + "上傳成功");
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
        }
        return item;
      });
      return newUploadFile;
    });
  }

  return (
    <tr>
      <td>{number}</td>
      <td>{fileName}</td>
      <td className={fileStatus === "READY" ? "ready" : "success"}>{fileStatus}</td>
      <td>Created&ensp;Time:{processingProgress}</td>
      <td>{fileSize}</td>
      <td>
        {/* 代改 */}
        <button className="edit-icon-button" onClick={deleteItem}>
          <DeleteIcon />
        </button>
        <button className="edit-icon-button" onClick={uploadItem}>
          <UploadIcon />
        </button>
        {/* <button onClick={uploadItem} className="btnUpload">
          Upload
        </button>
        <button onClick={deleteItem} className="btnReset">
          Delete
        </button> */}
      </td>
    </tr>
  );
};

export default Item;
