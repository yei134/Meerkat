import React from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";

const Content = ({ datasetName, title, groupsName, org_title, author, maintainer, createTime, modifiedTime, notes, files, tags, org_id }) => {
  return (
    <div className="flex-container">
      <ConLeft
        key={datasetName}
        name={datasetName}
        title={title}
        groupsName={groupsName}
        org_title={org_title}
        org_id={org_id}
        author={author}
        maintainer={maintainer}
        createTime={createTime}
        modifiedTime={modifiedTime}
        tags={tags}
      />
      <ConRight key={notes} notes={notes} title={title} files={files} name={datasetName} />
    </div>
  );
};

export default Content;
