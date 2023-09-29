//套件
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from 'styled-components';
//檔案
import Item from "./item";
//icon庫
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChatIcon from '@mui/icons-material/Chat';
import UploadIcon from '@mui/icons-material/Upload';

const ConRight = ({symptom, symptomId, datasetName, datasetTitle, keywords}) => {
  var [ dicomList, setDicomList ] = useState([]);
  var [ distributedDicomList, setDistributedDicomList] = useState([]);
  const [ deleteObject, setDeleteObject ] = useState({});
  var [ deleteEcho, setDeleteEcho ] = useState();
  var [ dicomUIDs, setDicomUIDs ] = useState([]);
  var [pageNow, setPageNow] = useState(1) //當前頁數
  var [pagelist,setPaglist] = useState([]); //當前顯示的分頁列表
  var [ dicomlistNow, setDicomlistNow ]=useState();
  var [conditionNum,setConditionNum] = useState(10);

  //=== 頁數動態樣式 ===//
  const StyledButton = styled.button`
    background-color: ${props => (props.page===pageNow ? '#8b8b8b40' : 'transparent')};
    border-radius: 100px;
    font-size: medium;
    margin-left:10px;
    margin-right:10px;
  `;

  //=== 向後端拿取索引檔底下的studies ===//
  useEffect(()=>{
    if(symptomId!==undefined){
    axios.get(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studies`,
    {
      params:{
        id:symptomId
      },
      headers:{
        'Authorization': process.env.REACT_APP_CKAN_TOKEN,
      }
    })
    .then(response => {
      dicomList = response.data;
      setDicomList(dicomList);
      distributedDicomList = chunkArray(dicomList, conditionNum);
      setDistributedDicomList(distributedDicomList);
      setPageNow(1);
      pagehandle();
      dicomlistNow=distributedDicomList[pageNow-1];
      setDicomlistNow(dicomlistNow);
    })
    .catch(error=>{
      console.log(error)
      console.log("symptomId="+symptomId);
      // 若是發生error, 將dicomList清空, 避免存留上一次拿到的值
      dicomList = [];
      setDicomList(dicomList);
    });

    }
  },[symptomId,conditionNum])

  //=== 判斷頁數列表的顯示 ===//
  const pagehandle = () =>{
    if(distributedDicomList.length<5){
      for(var i=0;i<distributedDicomList.length;i++){
        pagelist[i]=i+1;
        console.log(i);
      }
    }else{
      if(pageNow<=2){
        pagelist[0]=1;
        pagelist[1]=2;
        pagelist[2]=3;
        pagelist[3]=4;
        pagelist[4]=5;
      }else if(pageNow>=distributedDicomList.length-2){
        pagelist[0]=distributedDicomList.length-4;
        pagelist[1]=distributedDicomList.length-3;
        pagelist[2]=distributedDicomList.length-2;
        pagelist[3]=distributedDicomList.length-1;
        pagelist[4]=distributedDicomList.length;
      }else if(pageNow>2 && pageNow<distributedDicomList.length){
        pagelist[0]=pageNow-2;
        pagelist[1]=pageNow-1;
        pagelist[2]=pageNow;
        pagelist[3]=pageNow+1;
        pagelist[4]=pageNow+2;
      }
    }
    console.log(pagelist);
    setPaglist(pagelist);
  }

  //=== 處理checkbox陣列值-增 ===//
  const handleValueFromChildAdd = (value) => {
    deleteObject.indexID = symptomId;
    dicomUIDs.push(value); //等子層級(item)呼叫並改變deleteObject值
    deleteObject.StudyInstanceUID = dicomUIDs;
    console.log(dicomUIDs);
  };

  //=== 處理checkbox陣列值-減 ===//
  const handleValueFromChildDelete = (value) => {
    var deleted = true;
    const dicomFilter = dicomUIDs.filter(item => {
      deleted=value !== item;
      return deleted;
    })
    setDicomUIDs([]);
    setDicomUIDs(dicomFilter);
    console.log(dicomFilter);
    deleteObject.StudyInstanceUID = dicomFilter;
    console.log(dicomUIDs);
  }

  //=== 呼叫後端API刪studies ===//
  function deleteRaccoonDicom() {
    const FormData = JSON.stringify(deleteObject);
    if(deleteObject !== undefined){
      axios.delete(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studiesDelete`, {
        data:FormData,
        headers: {
          "Authorization": process.env.REACT_APP_CKAN_TOKEN,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        deleteEcho = response.data;
        setDeleteEcho(setDeleteEcho);
        console.log(deleteEcho.deletedDICOM);
        alert("成功刪除"+deleteEcho.deletedDICOM.length+"筆資料");
        window.location.reload();
      })
      .catch(error => {
        // delecteEcho=error;
        console.log(error);
        console.log(deleteObject);
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
    if(e.target.value>=1){
      pageNow=parseInt(e.target.value);
      setPageNow(pageNow);
    }
    dicomlistNow=distributedDicomList[pageNow-1];
    setDicomlistNow(dicomlistNow);
    pagehandle();
  };

  //=== 監聽上一頁button ===//
  const minuspageStateChange = () => {
    if(pageNow>1){
      pageNow=pageNow-1;
      setPageNow(pageNow);
    }
    dicomlistNow=distributedDicomList[pageNow-1];
    setDicomlistNow(dicomlistNow);
    pagehandle();
  };

  //=== 監聽下一頁button ===//
  const pluspageStateChange = () => {
    if(pageNow<distributedDicomList.length){
      pageNow=pageNow+1;
      setPageNow(pageNow);
    }
    dicomlistNow=distributedDicomList[pageNow-1];
    setDicomlistNow(dicomlistNow);
    pagehandle();
  };
  //=== 下拉選單 選擇顯示資料筆數 ===//
  const handleConditionChange = (e) => {
    setConditionNum(parseInt(e.target.value));
  }
  return(
    <div className="conRight">
      {dicomlistNow &&(
        <div>
          <div className="route">
            <div className="flex-container-column-symptom">
              <font className="symptom-fontTitle">{symptom}</font>
              <font className="symptom-fontIndex">{datasetName}{keywords}{symptom}</font>
            </div>
            <div className="route">
              <HomeIcon/>
              <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>
              /
              <a href={`/datasetInfo/${datasetName}`}>&nbsp;&nbsp;{datasetTitle}&nbsp;&nbsp;</a>
              /
              <a href={`/datasetInfo/${datasetName}/dicomManage`} className="page">&nbsp;&nbsp;dicom列表</a>
            </div>
            <div className="dicom-btn-container">
              <button className="edit-icon-button" onClick={deleteRaccoonDicom}><DeleteIcon/></button>
              <button className="edit-icon-button"><a href={`/datasetInfo/${datasetName}/fileUpload/${symptomId}`}><UploadIcon/></a></button>
            </div>
            <font className="symptom-fontIndex">共{dicomList.length}筆資料</font>
            <div className="select-condition-num">
              <select onChange={handleConditionChange}>
                <option value="10">一次10筆資料</option>
                <option value="15">一次15筆資料</option>
                <option value="20">一次20筆資料</option>
                <option value="25">一次25筆資料</option>
              </select>
            </div>
            <font className="symptom-fontIndex">共{distributedDicomList.length}頁</font>
          </div>
          {dicomlistNow && (
          <table className="table">
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
                  />
                );
              })}
            </tbody>
          </table>
          )}
          {pagelist && (
            <div className="pagelist-container">
              <button onClick={minuspageStateChange} className="icon-button" title={"上一頁"}>
                <KeyboardArrowLeftIcon/>
              </button>
              {pagelist.map((item,index)=>{
                return(
                  <StyledButton 
                    key={index}
                    page={item}
                    value={item}
                    onClick={pageStateChange}
                    className="icon-button">
                      {item}
                  </StyledButton>
                )
              })}
              <button onClick={pluspageStateChange} className="icon-button" title={"下一頁"}>
                <KeyboardArrowRightIcon/>
              </button>
            </div>
          )}
        </div>
      )}
      {!dicomlistNow &&(
        <div>
          <div className="route">
              <HomeIcon/>
              <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>
              /
              <a href={`/datasetInfo/${datasetName}`}>&nbsp;&nbsp;{datasetTitle}&nbsp;&nbsp;</a>
              /
              <a href={`/datasetInfo/${datasetName}/dicomManage`} className="page">&nbsp;&nbsp;dicom列表</a>
          </div>
          <div className="alert_font_style">
            <ChatIcon/>&nbsp;尚未擁有索引檔，請先建立！
          </div>
        </div>
      )}
    </div>
  );
};
export default ConRight;