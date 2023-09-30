import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./item";
import ListAltIcon from '@mui/icons-material/ListAlt';

const PackageList=({displayInfoID})=>{
  var [ packageList, setPackageList ] = useState();
  useEffect(()=>{
    const getOrgInfo = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_package_list`,
            {params:{id:displayInfoID},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          console.log(response.data);
          packageList = response.data;
          setPackageList(packageList);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(displayInfoID!==undefined){
      getOrgInfo();
    }
  },[displayInfoID])
  return(
    <div>
      <div>
        <span className="edit-title-style"><ListAltIcon/>&nbsp;Organization's&nbsp;Dataset&nbsp;List</span>
      </div>
      {packageList &&(
        packageList.map((value, index)=>{
          return(
            <Item title={value.title} notes={value.notes} name={value.name} key={index}/>
          )
        })
      )}
    </div>
  );
}
export default PackageList;