import { useState } from "react";
import ReactModal from "react-modal";
//下載modal指令:install react-modal
//modal教學:https://ithelp.ithome.com.tw/m/articles/10289383
function ActionBotton({ setUploadFile }) {
  const [showModal, setShowModal] = useState(false); // 新增狀態來判斷是否顯示彈跳視窗
  function deleteItems() {
    setUploadFile((prev) => prev.filter((item) => !item.isChecked));
  }//按下確認，則會使用 setUploadFile 來過濾掉已勾選的項目，同時將 isDeleteMode 和 isDeleting 狀態都設定為 false，表示完成了刪除動作
  function handleDelete() {
    setShowModal(true); // 設定彈跳視窗為顯示狀態
  }
  function closeModal() {
    setShowModal(false); // 設定彈跳視窗為隱藏狀態
  }
  function handleDeleteConfirm() {
    deleteItems();
    closeModal(); // 執行刪除動作並關閉彈跳視窗
  }
  return (
    <div className="test">
      <button onClick={handleDelete} className="btnReset">
        刪除
      </button>
      {/* 彈跳視窗內容
         isOpen 是否顯示彈跳視窗
         onRequestClose 關閉時回傳的函數
      */}
      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Delete Modal"
        className="modal">
        <h2>確認要刪除嗎？</h2>
        <div className="modal-button">
          <button onClick={closeModal}>取消</button>
          <button onClick={handleDeleteConfirm}>確定</button>
        </div>
      </ReactModal>
    </div>
  )
}
export default ActionBotton;

// //透過 fetch 函式向伺服器取得下載檔案的資料，取得回應後會得到一個 Response 物件。
// const response = await fetch(downloadUrl);

// 從 Response 物件中取得檔案的二進位資料(blob)。
// const blob = await response.blob();

// 透過 window.URL.createObjectURL() 創建一個 URL 物件，用來表示下載檔案的位置。
// const url = window.URL.createObjectURL(new Blob([blob]));

// 創建一個超連結 a 的 HTML 元素，設定它的 href 屬性為剛剛取得的 URL，設定 download 屬性為檔案的名稱，將此超連結元素新增至文件的 body 內。