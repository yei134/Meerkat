import React, { useState,useEffect } from "react";
import PortraitIcon from '@mui/icons-material/Portrait';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';

const ConLeft = ({author, groupsName, createTime, modifiedTime, ownerOrg, tags, maintainer, title }) => {
  var createDate = "";
  var modifiedDate = "";
  
  const [imgUrl, setImgUrl] = useState(""); // 儲存圖片 URL

 useEffect(() => {
  const getOrg = async () => {
    try {
     const orgId = ownerOrg.replace(/\s+/g, '-');
      
      console.log(orgId);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`,
        { params: { id: orgId }, headers: { 'Authorization': process.env.REACT_APP_CKAN_TOKEN } }
      );
      const responseData = response.data;
      const imageUrl = responseData.image_display_url; 
      setImgUrl(imageUrl); 
      console.log(responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  if (ownerOrg) {
    getOrg();
  }
}, [ownerOrg]);

  if(typeof createTime === "string"){
    createDate = createTime.slice(0, 10);
  }
  if(typeof modifiedTime === "string"){
    modifiedDate = modifiedTime.slice(0, 10);
  }

  return (
    <div className="ABconleft">
      <div className="conleft-datasetname-style">
        {title}
      </div> 
      <div className="conleft-title-style">所屬組織</div>
      <div className="conleft-org-container">
        <img src={imgUrl} />
         <div>{ownerOrg}</div>
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