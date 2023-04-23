import { v4 } from "uuid";

//多檔案上傳參考:https://ithelp.ithome.com.tw/articles/10269464
//js基本操作:https://ithelp.ithome.com.tw/articles/10274961

function ActionBotton({ setUploadFile }) {
  var time = Date(); //取得現在時間
  time = time.split(" "); //將取得的值用空白分割
  time = time[3] + "-" + time[1] + "-" + time[2] + " " + time[4]; //取出分割後需要的部分

  function add(event) {
    const files = event.target.files[0];
    console.log(files);
    setUploadFile(function (prev) {
      return [
        {
          id: v4(),
          fileName: files.name,
          modelClass: "",
          versionNumber: "0",
          processingProgress: time,
          fileSize: files.size,
          modelNote: "",
          modelPublic: false,
        },
        ...prev,
      ];
    });
  }

  return (
    <div>
      <span>
        <input type="file" onChange={add} />
      </span>
    </div>
  );
}

export default ActionBotton;
