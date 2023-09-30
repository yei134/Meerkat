import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import Header from "./components/header";
import Content from "./components/content";
import OrgInfo from "./components/orgInfo";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function Organization() {
  var [ orglist, setOrglist ] = useState([]);
  const [ displayInfoID, setDisplayInfoID ] = useState();
  
  useEffect(() => {
    const getOrglist = async () => {
      try {
        await axios.get( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_list`,
              {headers:{'Authorization': process.env.REACT_APP_CKAN_TOKEN}}
        )
        .then(response => {
          orglist = response.data;
          setOrglist(orglist);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getOrglist();
  },[])

  function handleChoose (e) {
    console.log(e);
    setDisplayInfoID(e);
  }

  return (
    <>
    <Header></Header>
    <div className="organization-container">
      {orglist &&(
        <div className="organization-left">
          {
            orglist.map((item, index)=>{
              return(
                <Content
                  key={index}
                  orgName={item}
                  handleChoose={handleChoose}
               />)
            })
          }
        </div>
      )}
      <div className="organization-right">
        <OrgInfo
          displayInfoID={displayInfoID}
        />
      </div>
    </div>
    </>
  );
}

export default Organization;