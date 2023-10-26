//套件
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
//檔案
import ConRight from "./conright";
//icon庫
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Content = ({ datasetName, datasetTitle, files }) => {
  const keywords = "_[type]_"; //辨別[索引檔]和[附件檔]的關鍵詞
  var [indexFiles, setIndexFiles] = useState([]); //資料集內的索引檔
  var [symptoms, setSymptoms] = useState([]); //資料集名稱+病徵名稱
  var [symptomsInfo, setSymptomsInfo] = useState([]); //資料集名稱+病徵名稱+病徵ID
  var [symptomPick, setSymptomPick] = useState(); //選擇的病徵名稱
  var [symptomIdPick, setSymptomIdPick] = useState(); //選擇的病徵ID
  const [inputSymptom, setInputSymptom] = useState(""); //新增病徵
  const [deleteArray, setDeleteArray] = useState([]);

  // console.log(typeof(datasetName));
  const [open, setOpen] = React.useState(false); //新增病徵-對話框狀態(預設關)
  const handleClickDialogState = () => {
    setOpen(!open); //觸發新增病徵-對話框狀態(反向)
  };

  //=== 點擊新增病徵-對話框-SUBMIT, 接CkanAPI新增索引 ===//
  const AddSymptom = () => {
    axios.post(
      `${process.env.REACT_APP_BACKEND_URI}api/ckan/index_create`,
      {
        package_id: datasetName,
        symptom: inputSymptom,
      },
      {
        headers: {
          authorization: process.env.REACT_APP_CKAN_TOKEN,
        },
      }
    );
    setOpen(false);
  };

  function ChooseSymptoms(e) {
    var valueArray = e.target.value.split(",");
    setSymptomPick(valueArray[1]);
    setSymptomIdPick(valueArray[2]);
  }
  //=== 陣列處理 1.留下索引檔 2.將索引檔分割出病徵名稱 3.將ID加入陣列中 ===//
  useEffect(() => {
    if (Array.isArray(files) && files.length !== 0) {
      indexFiles = files.filter((item) => {
        return typeof item.name === "string" && item.name.includes(keywords);
      }); // 過濾掉的所有檔案[索引檔]
      setIndexFiles(indexFiles);
      symptoms = indexFiles.map((str) => {
        return str.name.split(keywords);
      }); // symptoms[1]為病徵名稱
      setSymptoms(symptoms);
      symptomsInfo = indexFiles.map((str, index) => {
        return symptoms[index].splice(3, 0, str.id); //把病徵ID加進陣列
      });
      if (symptoms.length !== 0) {
        setSymptomsInfo(symptomsInfo);
        setSymptomPick(symptoms[0][1]); //初始化-第一個病徵名
        setSymptomIdPick(symptoms[0][2]); //初始化-第一個病徵ID
      }
    }
  }, [files]);

  return (
    <>
      <div className="symptoms-list">
        <div className="flex-container-column">
          <font className="flex-container-column-index">{datasetTitle}</font>
          <hr />
          <div className="flex-container-column-index">
            <div className="add-symptoms-button-container">
              <button onClick={handleClickDialogState} title={"新增病徵"}>
                Add Symptom
              </button>
              <Dialog open={open} onClose={handleClickDialogState}>
                <DialogTitle>新增索引檔 - {datasetTitle}</DialogTitle>
                <DialogContent>
                  <DialogContentText>輸入病徵名稱，命名規則：</DialogContentText>
                  <TextField autoFocus margin="dense" id="name" label="symptom" type="email" fullWidth variant="standard" onChange={(e) => setInputSymptom(e.target.value)} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClickDialogState}>Cancel</Button>
                  <Button
                    onClick={() => {
                      setInputSymptom(inputSymptom);
                      AddSymptom();
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            {symptoms && (
              <div>
                {symptoms.map((item, index) => (
                  <div key={index}>
                    <button key={index} onClick={ChooseSymptoms} value={item} className="symptoms-button">
                      {item[1]}
                    </button>
                    <br />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <ConRight
          key={datasetTitle}
          symptom={symptomPick}
          symptomId={symptomIdPick}
          datasetName={datasetName}
          datasetTitle={datasetTitle}
          keywords={keywords}
          deleteArray={deleteArray}
          setDeleteArray={setDeleteArray}
        />
      </div>
      <Outlet />
    </>
  );
};

export default Content;
