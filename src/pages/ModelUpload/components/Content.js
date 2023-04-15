import React from "react";
import Item from "./Item";

function Content({ uploadFile, setUploadFile }) {
  return (
    <table>
      <thead>
        <tr>
          <th>NO.</th>
          <th>FileName</th>
          <th>Class</th>
          <th>Version&ensp;No.</th>
          <th>Processing&ensp;Progress</th>
          <th>FileSize</th>
          <th>Notes</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {uploadFile.map((item, index) => {
          const {
            id,
            fileName,
            modelClass,
            versionNumber,
            processingProgress,
            fileSize,
            modelNote,
            modelPublic,
          } = item;
          return (
            <Item
              key={id}
              id={id}
              number={index + 1}
              fileName={fileName}
              modelClass={modelClass}
              versionNumber={versionNumber}
              processingProgress={processingProgress}
              fileSize={fileSize}
              modelNote={modelNote}
              modelPublic={modelPublic}
              setUploadFile={setUploadFile} //如果需要刪除項目時需要的
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default Content;
