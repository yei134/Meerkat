import React from "react";
import List from "./list";

const Content = ({datasetList}) => {
  return (
    <div>
      {datasetList.map((item)=>{
        const datasetName = item;
        return <List datasetName={datasetName} key={datasetName}/>
      })}
    </div>
  );
};

export default Content;