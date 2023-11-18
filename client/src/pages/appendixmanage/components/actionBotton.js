// 套件
import axios from "axios";
import ReactModal from "react-modal";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
ReactModal.setAppElement("#root");

function ActionBotton({ selectedItems, setFileUploadCount, getCkanApiPackageShow }) {
  const [showModal, setShowModal] = useState(false);
  function deleteItems() {
    const postData = { resource_id: selectedItems };
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URI}api/ckan/resource_delete`, {
        headers: {
          Authorization: process.env.REACT_APP_CKAN_TOKEN,
          "Content-Type": "application/json",
        },
        data: postData,
      })
      .then((response) => {
        handleFileUploadSuccess();
        window.alert("刪除成功");
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //開啟刪除視窗
  function handleDelete() {
    setShowModal(true);
  }
  //關閉刪除視窗
  function closeModal() {
    setShowModal(false);
  }
  //視窗確認刪除
  function handleDeleteConfirm() {
    deleteItems();
    closeModal();
  }
  const handleFileUploadSuccess = () => {
    setFileUploadCount((prevCount) => prevCount + 1);
    getCkanApiPackageShow();
  };
  return (
    <span className="dicom-btn-container">
      <button className="edit-icon-button" onClick={handleDelete}>
        <DeleteIcon />
        附件刪除
      </button>
      <ReactModal isOpen={showModal} onRequestClose={closeModal} contentLabel="Delete Modal" className="modal">
        <h2>確認要刪除嗎？</h2>
        <div className="modal-button">
          <button onClick={closeModal}>取消</button>
          <button onClick={handleDeleteConfirm}>確定</button>
        </div>
      </ReactModal>
    </span>
  );
}
export default ActionBotton;
