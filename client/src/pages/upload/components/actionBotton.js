// import { useState, useEffectREADYuploadDiocomFile, useRef } from "react";
import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
import axios from 'axios';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
//多檔案上傳參考:https://ithelp.ithome.com.tw/articles/10269464
//js基本操作:https://ithelp.ithome.com.tw/articles/10274961
function ActionBotton({ datasetName, setUploadFile, deletealldata, status, setstatus, uploadFile, symptomId }) {
  var time = Date(); //取得現在時間
  time = time.split(" "); //將取得的值用空白分割
  time = time[3] + "-" + time[1] + "-" + time[2] + " " + time[4]; //取出分割後需要的部分
  var [packageDataInfo, setPackageDataInfo]=useState([]);
  const [title,setTitle]=useState("");
  var [ files, setFiles ]= useState();
  const keywords = "_[type]_";  //辨別[索引檔]和[附件檔]的關鍵詞
  var [ indexFiles, setIndexFiles ] = useState([]); //資料集內的索引檔
  var [ symptoms, setSymptoms ] = useState([]); //資料集名稱+病徵名稱
  var [ symptomsInfo, setSymptomsInfo] = useState([]); //資料集名稱+病徵名稱+病徵ID
  var [ symptomPick, setSymptomPick ] = useState(); //選擇的病徵名稱
  var [ symptomIdPick, setSymptomIdPick ] = useState(); //選擇的病徵ID

   useEffect(() => {
    const getDataset = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_show`,
          {params:{datasetName:datasetName}})
        .then(response => {
          packageDataInfo = response.data.result;
          setPackageDataInfo(packageDataInfo);
          setTitle(packageDataInfo.title);
          files=packageDataInfo.resources.map((resource)=>resource);
          setFiles(files);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDataset();
  },[])
  useEffect(() => {
    if(Array.isArray(files)){
      indexFiles = files.filter(item => {
        return typeof item.name === 'string' && item.name.includes(keywords);
      }); // 過濾掉的所有檔案[索引檔]
      setIndexFiles(indexFiles);
      symptoms = indexFiles.map((str) => {
        return str.name.split(keywords);
      }); // symptoms[1]為病徵名稱
      setSymptoms(symptoms)
      symptomsInfo = indexFiles.map((str, index) => {
        return symptoms[index].splice(3,0,str.id);  //把病徵ID加進陣列
      });
      setSymptomsInfo(symptomsInfo);
      setSymptomPick(symptoms[0][1]);
      setSymptomIdPick(symptoms[0][2]);
    };
  },[files]);
  function status() {
    setstatus(function (prev) {
      const newUploadFile = uploadFile.map((item) => {
        const formData = new FormData();
          formData.append('id', symptomId);
          formData.append('dicomFile', item.dicomFile);
          formData.append('description', symptomId);
          if(formData!=={}){
            axios.post(`${process.env.REACT_APP_BACKEND_URI}api/raccoon/studiesAppend`, formData, {
              headers: {
                "Authorization": process.env.REACT_APP_CKAN_TOKEN,
                "Content-Type": "multipart/form-data",
              },
            })
            .then(response => {
              console.log(response.data);
              return {
                ...item,
                fileStatus: "SUCCESS",
              };
            })
            .catch(error => {
              console.log(error);
            });
          }
        return item;
      });
      return newUploadFile;
    });
  }
  function deleteall() {
    deletealldata([])
  }
  function add(event) {
    const files = event.target.files;
    for (let element of files) {
      const uploadFileName = uploadFile.map((item)=>item.fileName);
      if(uploadFileName.includes(element.name)){
        alert(element.name+'檔案已存在');
      }else{
        setUploadFile(function (prev) {
          return [
            {
              dicomFile: element,
              id: v4(),
              fileName: element.name,
              fileStatus: "READY",
              processingProgress: time,
              fileSize: element.size,
            },
            ...prev,
          ];
        });
      }
      event.value={};
    }
  }
  return (
    <div className="flex-container-row">
      <div className="route">
        <EmojiFlagsIcon />
        <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>
        /
        <a href={`/datasetInfo/${datasetName}`}>&nbsp;&nbsp;{title}&nbsp;&nbsp;</a>
        /
        <a href={`/datasetInfo/${datasetName}/dicomManage`}>&nbsp;&nbsp;{title}&nbsp;dicom列表&nbsp;&nbsp;</a>
        /
        <a href={`/datasetInfo/${datasetName}/fileUpload`} className="page">&nbsp;&nbsp;{symptomPick}上傳區</a>
      </div>
      {/* className="upload" */}
      <label htmlFor='filenp'>
        <input type="file" id='filenp' onChange={add} accept=".dcm" multiple={true} />
        <span className="btnFile">瀏覽檔案</span>
      </label>
      <label htmlFor='filep'>
        <input type="file" id='filep' webkitdirectory="true" onChange={add} accept=".dcm" multiple={true} />
        <span className="btnFile">瀏覽資料夾</span>
      </label>
      <span />
      <button onClick={deleteall} className="btnReset">Reset</button>
      <button onClick={status} className="btnUpload">Upload</button>
    </div>
  )
}
export default ActionBotton;