// 套件
import axios from "axios";
import ReactModal from "react-modal";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
ReactModal.setAppElement("#root");

function ActionBotton({ selectedItems, setFileUploadCount }) {
  const [showModal, setShowModal] = useState(false);
  function deleteItems() {
    const postData = { resource_id: selectedItems };
    console.log(postData);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URI}api/ckan/resource_delete`, {
        headers: {
          Authorization: process.env.REACT_APP_CKAN_TOKEN,
          "Content-Type": "application/json",
        },
        data: postData,
      })
      .then((response) => {
        console.log(response);
        handleFileUploadSuccess();
        window.alert("刪除成功");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //開啟刪除視窗
  function handleDelete() {
    setShowModal(true);
    console.log("checked:", selectedItems);
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
  };
  return (
    <span className="dicom-btn-container">
      <button className="edit-icon-button" onClick={handleDelete}>
        <DeleteIcon />
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
