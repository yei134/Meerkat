// 套件
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import axios from "axios";
// 檔案
import "./index.css";
import VisualTable from "../../components/visualTable";
import { ckan_default, ckan_token } from "../../global/constants";

export default function Members() {
  const { keycloak } = useKeycloak();
  // 使用者keycloak資訊
  const [userInfo, setUserInfo] = useState({});
  // 可操作列表
  const [operationList, setOperationList] = useState([]);
  // 成員資料
  const [members, setMembers] = useState([]);
  // 欄位
  const field = [
    { id: 1, name: "index", display: "No." },
    { id: 2, name: "display_name", display: "Name" },
    { id: 3, name: "email_hash", display: "E-mail" },
    { id: 4, name: "capacity", display: "Role" },
  ];

  // 取keycloak中的user資料
  async function getUserInfo() {
    await keycloak
      .loadUserProfile()
      .then((res) => {
        setUserInfo(res);
        // console.log("keycloak.loadUserProfile:", res);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // 取得使用者所屬的組織
  async function getOperationList() {
    // 待補：透過saml取得user在ckan的name
    const userName = userInfo.email.split("@")[0];
    await axios
      .get(`${ckan_default}api/ckan/organization_list_for_user`, {
        params: { id: userName },
        headers: {
          Authorization: ckan_token,
        },
      })
      .then((res) => {
        // console.log("ckan.organization_list_for_user:", res);
        let tmp = [];
        res.data.map((element) => {
          if (element.capacity === "admin") {
            getOrgPackageList(element.id);
            tmp.push(element);
          }
        });
        setOperationList(tmp);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // 取得組織所擁有資料集
  async function getOrgPackageList(orgId) {
    await axios
      .get(`${ckan_default}api/ckan/organization_package_list`, {
        params: { id: orgId },
        headers: {
          Authorization: ckan_token,
        },
      })
      .then((res) => {
        // console.log(res);
        res.data.map((element) => {
          setOperationList((prev) => {
            return [...prev, element];
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function getMembers(type, id) {
    if (type === "organization") {
      await axios
        .get(`${ckan_default}api/ckan/organization_info`, {
          params: { id: id },
          headers: {
            Authorization: ckan_token,
          },
        })
        .then((res) => {
          setMembers(res.data.users);
          console.log(res.data.users);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    if (userInfo.email !== undefined) getOperationList();
  }, [userInfo]);

  return (
    <>
      {/* 操作選單 */}
      <div style={{ background: "#fff" }}>
        <ul>
          {operationList.map((element, index) => {
            // console.log(element);
            return (
              <li
                key={`operationList_${index}`}
                onClick={() => {
                  getMembers(element.type, element.id);
                }}
              >{`${element.type}:  ${element.title}`}</li>
            );
          })}
        </ul>
      </div>
      <div>
        <VisualTable field={field} data={members} />
      </div>
    </>
  );
}
