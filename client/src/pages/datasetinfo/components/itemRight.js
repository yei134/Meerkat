import "../index.css";

const ItemRight=(({name, format, last_modified, url})=>{
  var last_modified_date="";  //顯示用檔案最後修改時間
  var type="";  //顯示用檔名
  var imgSrc = "";  //存放檔案icon路徑

  //字串處理-擷取日期做顯示
  if(last_modified!==null){
    last_modified_date=last_modified.slice(0,10);
  }

  //img src分類-依format分配icon
  if(format=="PDF"){
    imgSrc='../filePDF.svg';
    type=".pdf";
  }else if(format=="DOC"){
    imgSrc='../fileDOC.svg';
    type=".doc";
  }else if(format=="PPTX"){
    imgSrc='../filePPT.svg';
    type=".pptx";
  }else if(format=="TXT"){
    imgSrc='../fileTXT.svg';
    type=".txt";
  }else if(format=="PNG"){
    imgSrc='../filePNG.svg';
    type=".png";
  }else if(format=="CSV"){
    imgSrc='../fileCSV.svg';
    type=".csv";
  }else{
    imgSrc='../fileUnknow.svg';
    type=".不知名檔案類型";
  }

  return(
    <div className="file-float-row">
      <div className="formate-a-style">
        <a href={url} download={`${name}${type}`}>
          <img src={imgSrc}alt={`${name}${type}`}className="formate-style" title={`下載 ${name}${type}`}/>
        </a>
      </div>
      <div className="file-float-column">
        <font className="format-font-title-style">{name}</font>
        <font className="format-font-time-style">最後更新：{last_modified_date}</font>
      </div>
    </div>
  )
})
export default ItemRight;