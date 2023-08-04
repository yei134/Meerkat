import React, { useState } from "react";
import ReactModal from "react-modal";
ReactModal.setAppElement("#root");

function UploadFile({ uploadFile, setUploadFile }) {
  const [file, setFile] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 計算所有檔案大小的加總
  const getTotalFileSize = (files) => {
    let totalSize = 0;
    files.forEach((file) => {
      totalSize += file.size;
    });
    return (totalSize / (1024 * 1024)).toFixed(1) + "MB";
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFile(Array.from(selectedFiles));
  };

  const handleUpload = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setFile([]);
    setShowModal(false);
  };

  const handleUploadConfirm = () => {
    if (file.length > 0) {
      file.forEach((uploadedFile) => {
        setUploadFile((prevFiles) => [...prevFiles, uploadedFile]);
        console.log("上傳成功！");
        console.log("已上傳的檔案名稱:", uploadedFile.name);
        console.log("已上傳的檔案大小:",(uploadedFile.size / (1024 * 1024)).toFixed(1) + "MB"
        );
      });
    }
    closeModal();
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
              <hr/>
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