import React, { useEffect, useState } from "react";
import axios from "axios";
import PackageList from "./packageList";

const OrgInfo=({displayInfoID})=>{
  var [ orgInfo, setOrgInfo ] = useState();
  const [ name, setName ] = useState();
  const [ image_url, setImage_url ] = useState();

  useEffect(()=>{
    const getOrgInfo = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`,
            {params:{id:displayInfoID},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          console.log(response.data);
          orgInfo = response.data;
          setOrgInfo(orgInfo);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(displayInfoID!==undefined){
      getOrgInfo();
    }
  },[displayInfoID])

  useEffect(()=>{
    if(orgInfo!==undefined){
      setName(orgInfo.display_name);
      setImage_url(orgInfo.image_display_url);
    }
  },[orgInfo])

  return(
    <>
    <div>
      <div className="org_info">
        <div>
          <img src={image_url}/>
        </div>
        <div>
          <font>{name}</font>
        </div>
      </div>
      <hr/>
      <div>
        <PackageList displayInfoID={displayInfoID}/>
      </div>
    </div>
    </>
  )
}
export default OrgInfo;