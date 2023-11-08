import React from "react";
import Item from "./Item";


function Content({ setFileStatus, uploadFile, setUploadFile, datasetName, symptomId }) {

  return (
    <div className="upload-content">
      <div>共載入{uploadFile.length}個檔案</div>
      <table className="uploadfile-container">
        <thead>
          <tr>
            <th>NO.</th>
            <th>FileName</th>
            <th>Status</th>
            <th>Processing Progress</th>
            <th>FileSize</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {uploadFile.map((item, index) => {
            const { id, fileName, fileStatus, processingProgress, fileSize } =
              item;
            return (
              <Item
                key={id}
                id={id}
                number={index + 1}
                fileName={fileName}
                fileStatus={fileStatus}
                processingProgress={processingProgress}
                fileSize={(fileSize /(1024*1024)).toFixed(1) + "MB"}
                uploadFile={uploadFile}
                setUploadFile={setUploadFile} //如果需要刪除項目時需要的
                setFileStatus={setFileStatus}
                symptomId={symptomId}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Content;