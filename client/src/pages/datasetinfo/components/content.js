import React from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";

const Content = ({datasetName, title, groupsName, ownerOrg, author, createTime, modifiedTime, notes, files}) => {
  // const [symptoms, setSymptoms]=useState([]); //resources.name 病徵名稱

  return (
    <div className="flex-container">
      <ConLeft
        key={datasetName}
        name = {datasetName}
        title = {title}
        groupsName = {groupsName}
        ownerOrg = {ownerOrg}
        author = {author}
        createTime={createTime}
        modifiedTime={modifiedTime}
      />
      <ConRight
        key={notes}
        notes = {notes}
        title = {title}
        files = {files}
        name = {datasetName}
      />
    </div>
  );
}

export default Content;