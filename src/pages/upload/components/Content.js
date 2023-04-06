import React from "react";
import Item from "./Item";

function Content({ uploadFile, setUploadFile }) {
  return (
    <table>
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
          const { id, fileName, fileStatus, processingProgress, fileSize } = item;
          return (
            <Item
              key={id}
              id={id}
              number={index + 1}
              fileName={fileName}
              fileStatus={fileStatus}
              processingProgress={processingProgress}
              fileSize={fileSize}
              setUploadFile={setUploadFile} //如果需要刪除項目時需要的
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default Content;
