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
import BookmarkIcon from "@mui/icons-material/Bookmark";

const Content = ({ datasetName }) => {
  const [files, setFiles] = useState([]);
  const [datasetTitle, setDatasetTitle] = useState();
  const [datasetInfo, setDatasetInfo] = useState();
  const [add200, setAdd200] = useState();
  const keywords = "_[type]_"; //辨別[索引檔]和[附件檔]的關鍵詞
  const [symptomsInfo, setSymptomsInfo] = useState([]); //資料集名稱+病徵名稱+病徵ID
  const [indexFiles, setIndexFiles] = useState([]); //資料集內的索引檔
  const [symptoms, setSymptoms] = useState([]); //資料集名稱+病徵名稱
  const [symptomPick, setSymptomPick] = useState(); //選擇的病徵名稱
  const [symptomIdPick, setSymptomIdPick] = useState(); //選擇的病徵ID
  const [inputSymptom, setInputSymptom] = useState(""); //新增病徵
  const [deleteArray, setDeleteArray] = useState([]);
  const [open, setOpen] = React.useState(false); //新增病徵-對話框狀態(預設關)
  const handleClickDialogState = () => {
    setOpen(!open); //觸發新增病徵-對話框狀態(反向)
  };

  //=== 以package_show拿取當前資料集之資料 ===//
  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`, { params: { datasetName: datasetName }, headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } })
          .then((res) => {
            const tmp = res.data;
            setDatasetInfo(tmp);
            const tmp_files = tmp.resources.map((resource) => resource);
            setFiles(tmp_files);
            setDatasetTitle(tmp.title);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getDataset();
  }, [add200]);

  //=== 點擊新增病徵-對話框-SUBMIT, 接CkanAPI新增索引 ===//
  const AddSymptom = () => {
    const newSymptoms = [inputSymptom];
    console.log(newSymptoms);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}api/ckan/index_create`,
        {
          package_id: datasetName,
          symptoms: newSymptoms,
        },
        {
          headers: {
            authorization: process.env.REACT_APP_CKAN_TOKEN,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status == "200") {
          const append = res.data.append;
          setAdd200(append); //改變新增成功狀態，並觸發頁面重新取值
          setInputSymptom(""); //清空輸入值
          setOpen(false); //關閉對話框
          alert(append + " successfully created！");
        } else {
          alert("Error");
        }
      })
      .catch((error) => console.log(error));
  };

  function ChooseSymptoms(e) {
    setSymptomPick(e[1]);
    setSymptomIdPick(e[2]);
  }
  //=== 陣列處理 1.留下索引檔 2.將索引檔分割出病徵名稱 3.將ID加入陣列中 ===//
  useEffect(() => {
    console.log(files);
    if (Array.isArray(files) && files.length !== 0) {
      const index_Files = files.filter((item) => {
        return typeof item.name === "string" && item.name.includes(keywords);
      }); // 過濾掉的所有檔案[索引檔]
      setIndexFiles(index_Files);
      const symptoms_name = index_Files.map((str) => {
        return typeof str.name === "string" && str.name.split(keywords);
      }); // symptoms[1]為病徵名稱
      setSymptoms(symptoms_name);
      console.log(index_Files);
    }
  }, [files]);
  useEffect(() => {
    if (symptoms !== null) {
      const symptoms_Info = indexFiles.map((str, index) => {
        console.log(symptoms);
        return typeof symptoms[index] === "object" && symptoms[index].splice(3, 0, str.id); //把病徵ID加進陣列
      });
      if (Array.isArray(symptoms[0]) && symptoms[0].length == 3) {
        setSymptomPick(symptoms[0][1]); //初始化-第一個病徵名
        setSymptomIdPick(symptoms[0][2]); //初始化-第一個病徵ID
      }
    }
  }, [symptoms]);
  return (
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
                <TextField autoFocus margin="dense" id="name" label="symptom" type="email" variant="standard" onChange={(e) => setInputSymptom(e.target.value)} />
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
                  <button key={index} onClick={() => ChooseSymptoms(item)} value={item} className="symptoms-button">
                    <BookmarkIcon />
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
  );
};

export default Content;
