import React, { useState } from "react";
import ReactModal from "react-modal";
import axios from 'axios';
ReactModal.setAppElement("#root");
//上傳檔案按鈕1
function UploadFile({ datasetName,fileUploadCount, setFileUploadCount }) {

  const [file, setFile] = useState([]);
  // const [description, setdescription] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // 計算所有檔案大小的加總
  const getTotalFileSize = (file) => {
    let totalSize = 0;
    file.forEach((file) => {
      totalSize += file.size;
    });
    return (totalSize / (1024 * 1024)).toFixed(1) + "MB";
  };

  const handleFileChange = (event) => {
    ; const selectedFiles = event.target.files;
    setFile(Array.from(selectedFiles));
  };
  const handleUpload = () => {
    setShowModal(true);
  };
  const handleFileUploadSuccess = () => {
    if (file.length > 0) {
      setFileUploadCount(prevCount => prevCount + 1);
    }
    };

  const closeModal = () => {
    setFile([]);
    setShowModal(false);
  };

  const handleUploadConfirm = async () => {
    try {
      // resourceFile is required or throw error response
      if (file) {
        // 做post請求的data參數
        const packageID = datasetName;

        // 前端post過來的OauthToken
        const header = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJFUnI3MkpHUmdBaUt3T0FsdE5JeVhRNGUyUS1kSTAyX2J1VXFNZFNsZkJVdTNidlBvT3lXWUVWV0IyeTN1TUhSSUlvVWNaelNlVE96aVVYYyIsImlhdCI6MTY4MzE5OTA1MH0.LK0VQp8BmR_wzF5p-jAnkvX_IQVqPajeM-zM7USsvv4";

        // 包成key-value
        const headers = 
        { 
          Authorization: header,
          'Content-Type': 'multipart/form-data' 
        };
     
        const resourceFiles = file;
       
        async function resourcesUpload() {
          for (let resourceFile of resourceFiles) {
            //宣告formdata物件
            const formData = new FormData();
            // package_id is required
            formData.append('package_id', packageID);
            // 將檔案轉成blob屬性
            const blob = new Blob([resourceFile]);
            formData.append('resourceFile', blob, resourceFile.name);
            formData.append('resourceName', resourceFile.name);
            // 對ckan平台做post請求
            await axios({
              method: "post",
              url: `${process.env.REACT_APP_BACKEND_URI}api/ckan/resource_create`,
              data: formData,
              headers: headers,
            })
            .then(getRes => {
              console.log(getRes)
              handleFileUploadSuccess();
            })
            .catch(err => {
              console.log("err=" + err);
            })
           }
        }
        resourcesUpload();
        window.alert("上傳成功");
        console.log(resourceFiles)
      } else {
        throw Error("no resourceFile uploaded.");
      }
    } catch (error) {
      // ckan返回請求錯誤的訊息
      console.error(error);
      console.log(('Error fetching data from external API'));
      window.alert("上傳失敗"); // 顯示失敗訊息
    }
    finally {
      // 無論上傳成功或失敗，最後都執行 closeModal
      closeModal();
    }
  };

  return (
    <div className="test">
      <button onClick={handleUpload} className="button">
        上傳檔案
      </button>
      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Upload Modal"
        className="modal"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
      >
        <h2>選擇要上傳的檔案</h2>
        {file.length > 0 && (
          <div className="custom-modal">
            {file.map((file, index) => (
              <div key={index}>
                <p>Filename: {file.name} </p>
                <p>Size: {(file.size / (1024 * 1024)).toFixed(1)}MB</p>
              </div>
            ))}
            <hr />
            <p>總大小: {getTotalFileSize(file)}</p>
          </div>
        )}
        <label htmlFor="fileInput">
          <input type="file" id="fileInput" onChange={handleFileChange} accept="true" multiple="multiple" />
          <span className="btnFile1">上傳檔案</span>
        </label>
        <div className="modal-button">
          <button onClick={closeModal}>取消</button>
          <button onClick={handleUploadConfirm}>上傳</button>
        </div>
      </ReactModal>
    </div>
  );
}
export default UploadFile;

