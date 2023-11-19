// 套件
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// 檔案
import "./index.css";
import Content from "./components/content";
import ActionBotton from "./components/actionBotton";
import UploadFile from "./components/uplaodBotton";
import axios from "axios";

function Apendmanage() {
  const navigate = useNavigate();
  const datasetName = useParams().getId;
  const [selectedItems, setSelectedItems] = useState([]); // selectedItems 勾選狀態
  const [fileUploadCount, setFileUploadCount] = useState(0); // fileUploadCount上傳計數
  const [datasetInfo, setDatasetInfo] = useState({ name: datasetName }); // datasetInfo資料集資訊

  async function getCkanApiPackageShow() {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, {
        params: { datasetName: datasetInfo.name },
        headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN },
      })
      .then((response) => {
        const tmp = response.data;
        setDatasetInfo(tmp);
      })
      .catch((e) => {
        alert("頁面獲取失敗，請從新獲取");
        navigate(`/datasetInfo/${datasetName}`);
      });
  }
  useEffect(() => {
    getCkanApiPackageShow();
  }, [datasetName]);

  return (
    <>
      <div className="append-buttonArea">
        {/* 刪除 */}
        <ActionBotton selectedItems={selectedItems} fileUploadCount={fileUploadCount} setFileUploadCount={setFileUploadCount} getCkanApiPackageShow={getCkanApiPackageShow} />
        {/* 上傳 */}
        <UploadFile datasetName={datasetName} fileUploadCount={fileUploadCount} setFileUploadCount={setFileUploadCount} getCkanApiPackageShow={getCkanApiPackageShow} />
      </div>
      {/* 左側資訊欄&右側附件列表 */}
      <Content datasetInfo={datasetInfo} selectedItems={selectedItems} setSelectedItems={setSelectedItems} fileUploadCount={fileUploadCount} />
    </>
  );
}
export default Apendmanage;
//    _____ home______
//   |            |       |
// action(後端刪除，取得點選的id陣列)  content   header
//                  |
//            conleft+conright(勾選狀態)
