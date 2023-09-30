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
    { id: 2, name: "name", display: "Name" },
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
    let api = "";
    if (type === "organization") {
      api = `${ckan_default}api/ckan/organization_info`;
    } else if (type === "dataset") {
      api = `${ckan_default}api/ckan/collaborator_list`;
    }
    if (api !== "") {
      await axios
        .get(api, {
          params: { id: id },
          headers: {
            Authorization: ckan_token,
          },
        })
        .then((res) => {
          console.log(res);
          if (type === "organization") {
            const tmp = res.data.users;
            let data = [];
            tmp.map((element) => {
              element.name = element.display_name;
              data.push(element);
            });
          } else if (type === "dataset") {
            const tmp = res.data;
            let data = [];
            tmp.map((element) => {
              const { name, email_hash } = getCkanUser(element.user_id);
            });
          }
          type === "organization" ? setMembers(res.data.users) : setMembers(res.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
  // 取得ckan的user資訊
  async function getCkanUser(id) {
    const res = await axios
      .get(`${ckan_default}api/ckan/user_show`, {
        params: { id: id },
        headers: {
          Authorization: ckan_token,
        },
      })
      .then((res) => {
        console.log(res);
        return { name: res.data.name, email_hash: res.data.email_hash };
      })
      .catch((e) => {
        return { name: "", email_hash: "" };
      });
    return res;
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
      {/* 變更權限 */}
      <div style={{ background: "#ff0", position: "fixed", top: "5rem", left: "5rem" }}>
        <RoleChange />
      </div>
    </>
  );
}
function RoleChange({ org, name, role }) {
  const roleList = [
    { id: 0, value: "admin", display: "admin" },
    { id: 1, value: "editor", display: "editor" },
    { id: 2, value: "member", display: "member" },
  ];
  return (
    <>
      <font>權限變更-{org}</font>
      <font>{name}</font>
      <font>目前權限:{role}</font>
      <font>
        更改為:
        <select name="role">
          {roleList.map((element) => {
            return (
              <option key={`role_${element.id}`} value={element.value}>
                {element.display}
              </option>
            );
          })}
        </select>
      </font>
    </>
  );
}
