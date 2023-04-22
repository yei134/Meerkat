import React from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";

const Content = () => {
  return (
    <div className="flex-container">
      <ConLeft/>
      <ConRight/>
    </div>
  );
};

export default Content;