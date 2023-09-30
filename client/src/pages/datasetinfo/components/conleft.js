//套件
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from 'axios';
import PortraitIcon from '@mui/icons-material/Portrait';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ConLeft = ({author, groupsName, createTime, modifiedTime, org_title, org_id, tags, maintainer, title}) => {

  var createDate = "";
  var modifiedDate = "";
  var [ org_image_url, setOrg_image_url ] = useState();
  useEffect(() => {
    const getDataset = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`,
              {params:{id:org_id},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          org_image_url=response.data.image_display_url;
          setOrg_image_url(org_image_url);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(org_id!==undefined){
      getDataset();
    }
  },[org_id])
  
  //字串分割，只保留整段時間的前10碼，只留日期
  if(typeof createTime === "string"){
    createDate = createTime.slice(0, 10);
  }
  if(typeof modifiedTime === "string"){
    modifiedDate = modifiedTime.slice(0, 10);
  }
  return (
    <div className="conleft">
      <div className="conleft-datasetname-style">
        {title}
      </div> 
      <div className="conleft-title-style">所屬組織</div>
      <div className="conleft-org-container">
        <div className="org_img_container">
          <img src={org_image_url} className="org_img"></img>
        </div>
        <hr></hr>
        <div className="org_title">{org_title}</div>
      </div>
      <div className="conleft-title-style">相關人員</div>
      <div className="info-div-container">
        <div className="info-div-left">
          <PortraitIcon/><font>作者</font>
        </div>
        <font className="info-div-right">{author}</font>
      </div>
      <div className="info-div-container">
        <div className="info-div-left">
          <PortraitIcon/><font>管理者</font>
        </div>
        <font className="info-div-right">{maintainer}</font>
      </div>
      <div className="conleft-title-style">相關日期</div>
      <div className="info-div-container">
        <div className="info-div-left">
          <CalendarMonthIcon/><font>創建日期</font>
        </div>
        <font className="info-div-right">{createDate}</font>
      </div>
      <div className="info-div-container">
        <div className="info-div-left">
          <CalendarMonthIcon/><font>修改日期</font>
        </div>
        <font className="info-div-right">{modifiedDate}</font>
      </div>
      {tags &&(
          <div className="tag-button-container">
            {
              tags.map((element,index)=>{
                return(
                  <button key={index} className="tag-button">
                    #&nbsp;{element.display_name}
                  </button>
                )
              })
            }
          </div>
        )}
    </div>
  );
};

export default ConLeft;