import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";

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
    <div>
      <span>
        <input type="file" onChange={add} accept=".dicom" multiple display='none'/>          
      </span>
    </div>    
  )
}

export default ActionBotton;
