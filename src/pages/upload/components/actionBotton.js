import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
import "./actionBotton.css";

//多檔案上傳參考:https://ithelp.ithome.com.tw/articles/10269464
//js基本操作:https://ithelp.ithome.com.tw/articles/10274961

function ActionBotton({setUploadFile}) {
  var time = Date() //取得現在時間
  time = time.split(" "); //將取得的值用空白分割
  time = time[3] + "-" + time[1] + "-" + time[2] + " " + time[4]; //取出分割後需要的部分

  function add(event) {
    const files = event.target.files;
    for (let element of files){
      setUploadFile(function (prev) {
        console.log(prev);
        return [
          {
            id: v4(),
            fileName: element.name,
            fileStatus: "READY",
            processingPress: time,
            fileSize: element.size,
          },
          ...prev,
        ];
      });
    } 
  }

  return (
    <div className="upload">
      <label  for='filenp'>
    <input type="file" id='filenp'  onChange={add} accept=".dcm"  multiple='true' />
    <p className="buttonFile">上傳檔案</p>
    </label> 
    </div>

    
  )
}

export default ActionBotton;


/* --------------------------------
webkitdirectory="true" 上船資料夾*/