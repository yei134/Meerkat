import React from 'react';
import './actionBotton.css';
import Content from './Content.js'
//多檔案上傳參考:https://ithelp.ithome.com.tw/articles/10269464
//js基本操作:https://ithelp.ithome.com.tw/articles/10274961

function ActionBotton() {
  // let result_str = new Array();
  const handleOnChange = (event) => {
    var result_str = event.target.files
    Content(result_str)
  };
  return (
    (<span>
      <input type="file" onChange={handleOnChange} accept=".dicom" multiple />
    </span>)
  );
}

export default ActionBotton;