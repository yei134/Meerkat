//sz
import React, { useEffect, useState } from 'react';
import { api_get_data_newSet } from"../../../global/constants";
import { api_get_symptoms } from "../../../global/constants";
import axios from 'axios';
import ConLeft from "./conleft";
import ConRight from "./conright";

const Content = ({datasetName, title, groupsName, orgData, author, createTime, modifiedTime, notes, files}) => {
  // const [symptoms, setSymptoms]=useState([]); //resources.name 病徵名稱
  // const [ organization, setOrganization ] = useState();
  // setOrganization(orgData.title);
  // var organization = orgData.title;
  console.log(orgData);
  // console.log(orgData.title);

  return (
    <div className="flex-container">
      <ConLeft
        key={datasetName}
        datasetName = {datasetName}
        title = {title}
        groupsName = {groupsName}
        // organization = {organization}
        author = {author}
        createTime={createTime}
        modifiedTime={modifiedTime}
      />
      <ConRight
        key={notes}
        notes = {notes}
        title = {title}
        files = {files}
        datasetName = {datasetName}
      />
    </div>
  );
}

export default Content;