import React, { useState }from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";

const Content = ({datasetName, title, groupsName, ownerOrg, author, maintainer, createTime, modifiedTime, notes, files, tags}) => {

  return (
    <div className="flex-container">
      <ConLeft
        key={datasetName}
        name = {datasetName}
        title = {title}
        groupsName = {groupsName}
        ownerOrg = {ownerOrg}
        author = {author}
        maintainer={maintainer}
        createTime={createTime}
        modifiedTime={modifiedTime}
        tags={tags}
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