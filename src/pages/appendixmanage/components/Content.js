import React from "react";
import Item from "./Item";

function Content({ uploadFile, setUploadFile }) {
  return (
    <table>
      <thead>
        <tr>
          <th>NO.</th>
          <th>FileName</th>
          <th>Processing Progress</th>
          <th>FileSize</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {uploadFile.map((item, index) => {
          const { id, fileName,  processingProgress, fileSize } =
            item;
          return (
            <Item
              key={id}
              id={id}
              number={index + 1}
              fileName={fileName}
              processingProgress={processingProgress}
              fileSize={(fileSize /(1024*1024)).toFixed(1) + "MB"}
              setUploadFile={setUploadFile} //如果需要刪除項目時需要的
            />
          );
        })}
      </tbody>
    </table>
  );
}
export default Content;
