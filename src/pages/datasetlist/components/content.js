import React from "react";
import List from "./list";

const Content = ({datasetList}) => {
  console.log(datasetList);
  return (
    <div>
      <List/>
    </div>
  );
};

export default Content;