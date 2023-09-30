import { useState, useEffect, useRef } from "react";
import axios from 'axios';
const Item = ({
  id,
  number,
  fileName,
  fileStatus,
  processingProgress,
  fileSize,
  setUploadFile,
  uploadFile,
  symptomId
}) => {
  const [ uploadDiocomFile, setUploadDiocomFile ] = useState({});
  
  useEffect(()=>{console.log(uploadFile);},[uploadFile])
  function deleteItem() {
    setUploadFile(function (prev) {
      return prev.filter((item) => item.id !== id);
    });
  }
  function uploadItem() {
    var res={};
    console.log(symptomId);
    setUploadFile(function (prev) {
      const newUploadFile = prev.map((item) => {
        if (item.id === id) {
          console.log(item);
          console.log(item.dicomFile);
          const formData = new FormData();
          formData.append('id', symptomId);
          formData.append('dicomFile', item.dicomFile);
          formData.append('description', symptomId);
          if(formData!==undefined){
            axios.post(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studiesAppend`, formData, {
              headers: {
                "Authorization": process.env.REACT_APP_CKAN_TOKEN,
                "Content-Type": "multipart/form-data",
              },
            })
            .then(response => {
              console.log(response);
              res=response;
              alert(item.fileName+"上傳成功");
              if (res.status === 200) {
                console.log("File uploaded successfully.");
                return {
                  ...item,
                  fileStatus: "SUCCESS",
                };
              } else {
                console.log("File upload failed.");
                return item;
              }
            })
            .catch(error => {
              console.log(error);
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
      <td >
        {/* 代改 */}
        <button onClick={uploadItem} className="btnUpload" >Upload</button>
        <button onClick={deleteItem} className="btnReset">Delete</button>
      </td>
    </tr>
  );
};

export default Item;