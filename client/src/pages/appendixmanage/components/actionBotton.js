import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import axios from 'axios';
ReactModal.setAppElement("#root");
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJFUnI3MkpHUmdBaUt3T0FsdE5JeVhRNGUyUS1kSTAyX2J1VXFNZFNsZkJVdTNidlBvT3lXWUVWV0IyeTN1TUhSSUlvVWNaelNlVE96aVVYYyIsImlhdCI6MTY4MzE5OTA1MH0.LK0VQp8BmR_wzF5p-jAnkvX_IQVqPajeM-zM7USsvv4"

function ActionBotton({ selectedItems,setFileUploadCount }) {
  const [showModal, setShowModal] = useState(false);
  function deleteItems() {
    const postData = { resource_id: selectedItems }
    console.log(postData)
    axios.delete(`${process.env.REACT_APP_BACKEND_URI}api/ckan/resource_delete`,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        data: postData
      })
      .then((response) => {
        console.log(response)
        handleFileUploadSuccess();
        window.alert("刪除成功");

      })
      .catch((error) => {
        console.log(error)
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
    setFileUploadCount(prevCount => prevCount + 1);
  };
  return (
    <div className="test">
      <button onClick={handleDelete} className="button">
        刪除
      </button>
      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Delete Modal"
        className="modal"
      >
        <h2>確認要刪除嗎？</h2>
        <div className="modal-button">
          <button onClick={closeModal}>取消</button>
          <button onClick={handleDeleteConfirm}>確定</button>
        </div>
      </ReactModal>
    </div>
  );
}
export default ActionBotton;

