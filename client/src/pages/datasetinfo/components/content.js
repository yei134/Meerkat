import { useState, useEffect, useRef } from "react";
import { api_get_data_newSet } from"../../../global/constants";
import { api_get_symptoms } from "../../../global/constants";
import React from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";

const Content = ({listDataset, listSymptoms}) => {
  return (
    <div>
      {listDataset.map((item)=>{
        const {name, title, note, private_dataset, groups, ownerOrg, symptoms}=item;
        console.log(name);
        return(
          <div className="flex-container">
            <ConLeft
              key={name}
              name = {name}
              title = {title}
              groups = {groups}
              ownerOrg = {ownerOrg}
            />
            <ConRight
              key={name}
              note = {note}
              symptoms = {symptoms}
              title = {title}
            />
          </div>
        )
    })}
    </div>
    
  );
};

export default Content;