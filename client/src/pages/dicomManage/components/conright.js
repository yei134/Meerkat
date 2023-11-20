//套件
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
//檔案
import Item from "./item";
//icon庫
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ChatIcon from "@mui/icons-material/Chat";

const ConRight = ({ symptom, symptomId, datasetName, datasetTitle, keywords }) => {
  const [dicomList, setDicomList] = useState([]); //所有取得的檔案
  const [distributedDicomList, setDistributedDicomList] = useState([]);
  const [deleteObject, setDeleteObject] = useState({});
  const [deleteEcho, setDeleteEcho] = useState();
  const [dicomUIDs, setDicomUIDs] = useState([]);
  const [pageNow, setPageNow] = useState(1); //當前頁數
  const [pagelist, setPaglist] = useState([]); //當前顯示的分頁列表
  const [dicomlistNow, setDicomlistNow] = useState();
  const [conditionNum, setConditionNum] = useState(10);
  const [delete200, setDelete200] = useState("");

  //=== 頁數動態樣式 ===//
  const StyledButton = styled.button`
    background-color: ${(props) => (props.page === pageNow ? "#8b8b8b40" : "transparent")};
    border-radius: 100px;
    font-size: medium;
    margin-left: 10px;
    margin-right: 10px;
  `;

  //=== 向後端拿取索引檔底下的studies ===//
  useEffect(() => {
    console.log(symptomId);
    if (symptomId !== undefined) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studies`, {
          params: {
            id: symptomId,
          },
          headers: {
            Authorization: process.env.REACT_APP_CKAN_TOKEN,
          },
        })
        .then((res) => {
          const tmp = res.data;
          setDicomList(tmp); //所有取得的檔案
          const packagingDicom = chunkArray(tmp, conditionNum); //根據每一頁顯示數量打包
          setDistributedDicomList(packagingDicom);
        })
        .catch((error) => {
          console.error(error);
          setDicomList([]);
        });
    }
  }, [symptomId, conditionNum, deleteEcho]);

  //=== 當要顯示的病徵資料更新時 ===//
  useEffect(() => {
    // 從首頁顯示
    setPageNow(1);
  }, [distributedDicomList]);

  //=== 判斷頁數列表的顯示 ===//
  useEffect(() => {
    // 刷新頁數列表
    pagehandle();
    // 設定要顯示的資料
    setDicomlistNow(distributedDicomList[pageNow - 1]);
  }, [pageNow, distributedDicomList]);

  //=== 判斷頁數列表的顯示 ===//
  const pagehandle = () => {
    let updatePageList = [];
    if (distributedDicomList.length < 5) {
      for (let i = 0; i < distributedDicomList.length; i++) {
        updatePageList[i] = i + 1;
      }
    } else {
      if (pageNow <= 2) {
        updatePageList[0] = 1;
        updatePageList[1] = 2;
        updatePageList[2] = 3;
        updatePageList[3] = 4;
        updatePageList[4] = 5;
      } else if (pageNow >= distributedDicomList.length - 2) {
        updatePageList[0] = distributedDicomList.length - 4;
        updatePageList[1] = distributedDicomList.length - 3;
        updatePageList[2] = distributedDicomList.length - 2;
        updatePageList[3] = distributedDicomList.length - 1;
        updatePageList[4] = distributedDicomList.length;
      } else if (pageNow > 2 && pageNow < distributedDicomList.length) {
        updatePageList[0] = pageNow - 2;
        updatePageList[1] = pageNow - 1;
        updatePageList[2] = pageNow;
        updatePageList[3] = pageNow + 1;
        updatePageList[4] = pageNow + 2;
      }
    }
    setPaglist(updatePageList);
  };

  //=== 處理checkbox陣列值-增 ===//
  const handleValueFromChildAdd = (value) => {
    deleteObject.indexID = symptomId;
    dicomUIDs.push(value); //等子層級(item)呼叫並改變deleteObject值
    deleteObject.StudyInstanceUID = dicomUIDs;
  };

  //=== 處理checkbox陣列值-減 ===//
  const handleValueFromChildDelete = (value) => {
    var deleted = true;
    const dicomFilter = dicomUIDs.filter((item) => {
      deleted = value !== item;
      return deleted;
    });
    setDicomUIDs([]);
    setDicomUIDs(dicomFilter);
    deleteObject.StudyInstanceUID = dicomFilter;
  };

  //=== 呼叫後端API刪studies ===//
  function deleteRaccoonDicom() {
    const FormData = JSON.stringify(deleteObject);
    console.log(FormData);
    if (deleteObject !== undefined) {
      axios
        .delete(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studiesDelete`, {
          data: FormData,
          headers: {
            Authorization: process.env.REACT_APP_CKAN_TOKEN,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setDicomUIDs([]);
          console.log(deleteObject);
          console.log(res.data.deletedDICOM);
          let deleted_DICOM = res.data.deletedDICOM;
          setDeleteEcho(res.data);
          alert("成功刪除" + deleted_DICOM.length + "筆資料");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  //=== 將拿到的datasetlist做資料處理，每{chunkSize}個值裝進一個二維陣列 ===//
  function chunkArray(arr, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }

  //=== 監聽頁數button ===//
  const pageStateChange = (e) => {
    const clickPageNum = parseInt(e.target.value);
    if (clickPageNum >= 1) {
      setPageNow(clickPageNum);
    }
    setDicomlistNow(distributedDicomList[clickPageNum - 1]);
    pagehandle();
  };

  //=== 監聽上一頁button ===//
  const minuspageStateChange = () => {
    if (pageNow > 1) {
      setPageNow((prev) => prev - 1);
    }
  };

  //=== 監聽下一頁button ===//
  const pluspageStateChange = () => {
    if (pageNow < distributedDicomList.length) {
      setPageNow((prev) => prev + 1);
    }
  };

  //=== 下拉選單 選擇顯示資料筆數 ===//
  const handleConditionChange = (e) => {
    setConditionNum(parseInt(e.target.value));
  };

  return (
    <div className="conRight">
      <div className="route">
        <HomeIcon />
        <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>/<a href={`/datasetInfo/${datasetName}`}>&nbsp;&nbsp;{datasetTitle}&nbsp;&nbsp;</a>/
        <a href={`/datasetInfo/${datasetName}/dicomManage`} className="page">
          &nbsp;&nbsp;dicom列表
        </a>
      </div>
      {/* 以下有三種conright 1.還未建symptom 2.symptom還未擁有影像 3.正常顯示影像列表 */}
      {/* 1.還未建symptom */}
      {!symptom && (
        <div className="alert_font_style">
          <ChatIcon />
          &nbsp;This dataset does not have any symptoms yet. Please add them first.&nbsp;&nbsp;
        </div>
      )}
      {/* 2.symptom還未擁有影像 */}
      {symptom && !dicomlistNow && (
        <div>
          <div className="route">
            <div className="flex-container-column-symptom">
              <font className="symptom-fontTitle">{symptom}</font>
              <font className="symptom-fontIndex">
                {datasetName}
                {keywords}
                {symptom}
              </font>
            </div>
          </div>
          <div className="alert_font_style">
            <ChatIcon />
            &nbsp;This symptom does not have a file yet. Please upload it first.&nbsp;&nbsp;
            <a href={`/datasetInfo/${datasetName}/fileUpload/${symptom}/${symptomId}`}>
              <span className="flex-center">
                <UploadIcon />
                Upload
              </span>
            </a>
          </div>
        </div>
      )}
      {/* 3.正常顯示影像列表 */}
      {dicomlistNow && symptom && (
        <div>
          <div className="route">
            <div className="flex-container-column-symptom">
              <font className="symptom-fontTitle">{symptom}</font>
              <font className="symptom-fontIndex">
                {datasetName}
                {keywords}
                {symptom}
              </font>
            </div>
            <div className="dicom-btn-container">
              <div className="select-condition-num">
                <select onChange={handleConditionChange}>
                  <option value="10">一次10筆資料</option>
                  <option value="15">一次15筆資料</option>
                  <option value="20">一次20筆資料</option>
                  <option value="25">一次25筆資料</option>
                </select>
              </div>
              <button className="edit-icon-button">
                <a href={`/datasetInfo/${datasetName}/fileUpload/${symptom}/${symptomId}`}>
                  <span className="flex-center">
                    <UploadIcon />
                    Upload
                  </span>
                </a>
              </button>
              <button className="edit-icon-button" onClick={deleteRaccoonDicom}>
                <span className="flex-center">
                  <DeleteIcon />
                  Delete
                </span>
              </button>
            </div>
          </div>
          <table className="dicomManage-conrign-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>StudyInstanceUID</th>
                <th>SeriesInstanceUID</th>
                <th>SOPInstanceUID</th>
                <th>AcsessionNumber</th>
                <th>PatientID</th>
                <th>Modality</th>
                <th>StudyDescription</th>
                <th>type</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {dicomlistNow.map((item, index) => {
                return (
                  <Item
                    key={index}
                    number={index + 1}
                    symptomId={symptomId}
                    dicomUID={item.StudyInstanceUID}
                    AccessionNumber={item.AccessionNumber}
                    PatientID={item.PatientID}
                    SeriesInstanceUID={item.SeriesInstanceUID}
                    SOPInstanceUID={item.SOPInstanceUID}
                    StudyInstanceUID={item.StudyInstanceUID}
                    Modality={item.Modality}
                    StudyDescription={item.StudyDescription}
                    type={item.Type}
                    ValueAdd={handleValueFromChildAdd} // 改變deleteObject的值
                    ValueDelete={handleValueFromChildDelete}
                    deleteEcho={deleteEcho}
                  />
                );
              })}
            </tbody>
          </table>
          <font className="symptom-fontIndex2">
            共{dicomList.length}筆資料 / 共{distributedDicomList.length}頁
          </font>
          {/* 頁面切換列表 */}
          {pagelist && (
            <div className="pagelist-container">
              {pageNow > 1 && (
                <button onClick={minuspageStateChange} className="icon-button" title={"上一頁"}>
                  <KeyboardArrowLeftIcon />
                </button>
              )}
              {pagelist.map((item, index) => {
                return (
                  <StyledButton key={index} page={item} value={item} onClick={pageStateChange} className="icon-button">
                    {item}
                  </StyledButton>
                );
              })}
              {pageNow < distributedDicomList.length && (
                <button onClick={pluspageStateChange} className="icon-button" title={"下一頁"}>
                  <KeyboardArrowRightIcon />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ConRight;
