// import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
//多檔案上傳參考:https://ithelp.ithome.com.tw/articles/10269464
//js基本操作:https://ithelp.ithome.com.tw/articles/10274961
function ActionBotton({ setUploadFile, deletealldata, setstatus }) {
  var time = Date(); //取得現在時間
  time = time.split(" "); //將取得的值用空白分割
  time = time[3] + "-" + time[1] + "-" + time[2] + " " + time[4]; //取出分割後需要的部分
  function status() {
    setstatus(function (prev) {
      return prev.map((file) => {
        if (file.fileStatus === "READY") {
          return {
            ...file,
            fileStatus: "SUCCESS",
          };
        }
        return file;
      });
    });
  }
  function deleteall() {
    deletealldata([])
  }
  function add(event) {
    const files = event.target.files;
    for (let element of files) {
      setUploadFile(function (prev) {
        console.log(prev);
        return [
          {
            id: v4(),
            fileName: element.name,
            fileStatus: "READY",
            processingProgress: time,
            fileSize: element.size,
          },
          ...prev,
        ];
      });
      event.value={}
    }
  }
  return (
    <div>
      {/* className="upload" */}
      <label for='filenp'>
        <input type="file" id='filenp' onChange={add} accept=".dcm" multiple='true' />
        <span className="btnFile">上傳檔案</span>
      </label>
      <label for='filep'>
        <input type="file" id='filep' webkitdirectory="true" onChange={add} accept=".dcm" multiple='true' />
        <span className="btnFile">上傳資料夾</span>
      </label>
      <span />
      <button onClick={deleteall} className="btnReset">Reset</button>
      <button onClick={status} className="btnUpload">Upload</button>
    </div>
  )
}
export default ActionBotton;