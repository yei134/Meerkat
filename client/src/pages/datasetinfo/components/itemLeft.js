import "../index.css";

const ItemLeft = ({ name, format, last_modified, url }) => {
  let title = ""; //顯示用檔案名稱
  let last_modified_date = ""; //顯示用檔案最後修改時間
  let type = ""; //顯示用檔名
  let imgSrc = ""; //存放檔案icon路徑

  //字串處理-擷取日期做顯示
  if (last_modified !== null) {
    last_modified_date = last_modified.slice(0, 10);
  } else {
    last_modified_date = "不明";
  }
  //img src分類-依format分配icon
  if (format == "CSV") {
    imgSrc = "../fileIndex.svg";
    type = ".csv";
  } else {
    imgSrc = "../fileUnknow.svg";
    type = ".不知名檔案類型";
  }
  return (
    <div className="file-float-row">
      <div className="formate-a-style">
        <a href={url} download={`${name}${type}`}>
          <img src={imgSrc} alt={`${name}${type}`} className="formate-style" title={`下載 ${name}${type}`} />
        </a>
      </div>
      <div className="file-float-column">
        <font className="format-font-title-style">{name}</font>
        <font className="format-font-time-style">最後更新：{last_modified_date}</font>
      </div>
    </div>
  );
};
export default ItemLeft;
