import React,{useEffect,useState} from "react";
import axios from "axios";
import OrgList from "./orgList";

const Content = ({orgName, handleChoose}) => {
  var [ orgInfo, setOrgInfo ] = useState();
  const [ orgTitle, setOrgTitle ] = useState();
  const [ orgId, setOrgId ] = useState();
  const [ orgimage, setOrgImage ] = useState();
  const [ orgPackage_count, setOrgPackage_count ] = useState();
  const [ orgCreatedDate, setOrgCreatedDate ] = useState();
  useEffect(() => {
    const getOrg = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`,
              {params:{id:orgName},headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          console.log(response);
          orgInfo = response.data;
          setOrgInfo(orgInfo);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(orgName!==undefined){
      getOrg();
    }
  },[orgName])

  useEffect(()=>{
    const org_data = () =>{
      setOrgTitle(orgInfo.title);
      setOrgId(orgInfo.id);
      if(orgInfo.image_display_url!==""){
        setOrgImage(orgInfo.image_display_url);
      }else{
        setOrgImage("../undefined_url.svg");
      }
      setOrgPackage_count(orgInfo.package_count);
      if(typeof(orgInfo.created) === "string"){
        const createDate = orgInfo.created.slice(0, 10);
        setOrgCreatedDate(createDate);
      }
    }
    if(orgInfo!==undefined){
      org_data();
    }
  },[orgInfo])


  return(
    <div>
      {orgCreatedDate &&(
        <div className="list_orgs_container">
          <OrgList
            orgTitle = {orgTitle}
            orgimage = {orgimage}
            orgPackage_count = {orgPackage_count}
            orgId = {orgId}
            handleChoose={handleChoose}
          />
        </div>
      )}
    </div>
  )
}
export default Content;