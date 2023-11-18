import React, { useEffect, useState } from "react";
import axios from "axios";
const ConLeft = ({ owner_org, datasetTitle, groups, datasetName }) => {
  var [orgInfo, setOrgInfo] = useState();
  let Title = datasetTitle;
  const [org_title, setOrg_title] = useState();
  const [org_image_url, setOrg_image_url] = useState();
  var [groupsName, setGroupsName] = useState([]);

  useEffect(() => {
    const getOrg = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`, { params: { id: owner_org }, headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } })
          .then((response) => {
            orgInfo = response.data;
            setOrgInfo(orgInfo);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (owner_org !== undefined) {
      getOrg();
    }
  }, [owner_org]);

  useEffect(() => {
    const getOrgData = () => {
      setOrg_title(orgInfo.title);
      if (orgInfo.image_display_url !== "") {
        setOrg_image_url(orgInfo.image_display_url);
      } else {
        setOrg_image_url("../../../undefined_url.svg");
      }
    };
    if (orgInfo !== undefined) {
      getOrgData();
    }
  }, [orgInfo]);

  useEffect(() => {
    const getGroupsData = () => {
      groups.map((item, index) => {
        groupsName[index] = item.display_name;
      });
      setGroupsName(groupsName);
      console.log(groupsName);
    };
    if (groups !== undefined) {
      getGroupsData();
    }
  }, [groups]);

  return (
    <div className="edit-conleft">
      <div className="conleft-datasetname-style">{Title}</div>
      <div className="conleft-title-style">所屬組織</div>
      <div className="conleft-org-container">
        <div className="org_img_container">
          <img src={org_image_url} className="org_img"></img>
        </div>
        <hr></hr>
        <div className="org_title">{org_title}</div>
      </div>
      <div className="conleft-title-style">所屬群組</div>
      <div className="conleft-org-container">
        {groupsName.length !== 0 && <div>{groupsName[0]}</div>}
        {groupsName.length == 0 && <div>尚無所屬群組</div>}
      </div>
    </div>
  );
};
export default ConLeft;
