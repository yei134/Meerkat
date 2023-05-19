import { useState, useEffect, useRef } from "react";
import { api_get_data_newSet } from"../../../global/constants";
import { api_get_symptoms } from "../../../global/constants";
import React from "react";
import ConLeft from "./conleft";
import ConRight from "./conright";


const Content = ({listDataset, listSymptoms}) => {
  const [author, setAuthor]=useState([]); //author 資料集作者
  const [notes, setNotes]=useState([]); //notes 資料及註解
  const [title, setTitle]=useState([]); //title 資料集名稱
  const [createTime, setCreateTime]=useState([]); //metadata_created 創建時間
  const [modifiedTime, setModifiedTime]=useState([]); //metadata_modified 修改時間
  const [organization, setOrganization]=useState([]); //organization.title 資料集所屬組織
  const [symptoms, setSymptoms]=useState([]); //resources.name 病徵名稱
  return (
    <div>
      {/* {listDataset.map((item)=>{
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
    })} */}
    </div>
    
  );
};

export default Content;