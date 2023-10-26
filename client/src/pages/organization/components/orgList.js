import React, { useEffect, useState } from "react";

const OrgList=({orgTitle, orgimage, orgPackage_count, orgId, handleChoose})=>{
  const [ pickOrg, setPickOrg ] = useState();
  function handlePickOrg(e){
    console.log(e.target);
    setPickOrg(e.target.value);
    handleChoose(e.target.value);
  }

  return(
    <div className="list_org_container">
      <div className="org_image_container">
        <img src={orgimage} title={orgId}/>
      </div>
      <div title={orgId} className="org_image_title">
        <button onClick={handlePickOrg} value={orgId}>{orgTitle}</button>
      </div>
      <div className="org_package-count">
        <button>{orgPackage_count}</button>
      </div>
    </div>
  )
}
export default OrgList;