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
    { id: 3, name: "email", display: "E-mail" },
    { id: 4, name: "capacity", display: "Role" },
  ];

  // 取keycloak中的user資料
  async function getUserInfo() {
    await keycloak
      .loadUserProfile()
      .then((res) => {
        setUserInfo(res);
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
        let tmp = [];
        res.data.map((element) => {
          // 是org管理者時，取所有資料集
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
  // 取得選取範圍org/dataset內的成員
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
        .then(async (res) => {
          if (type === "organization") {
            const tmp = res.data.users;
            const memberInfo = await getCkanUser(tmp, "id", "organization", id);
            setMembers(memberInfo);
          } else if (type === "dataset") {
            const tmp = res.data;
            const memberInfo = await getCkanUser(tmp, "user_id", "dataset", id);
            setMembers(memberInfo);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
  // 取得ckan的user資訊 (type和id是為了表格操作放入的)
  async function getCkanUser(arr, field_name, type, id) {
    // promise將區塊內程序打包使執行序完全執行後才往下運行
    const res = await Promise.all(
      arr.map(async (element) => {
        return await axios
          .get(`${ckan_default}api/ckan/user_info`, {
            params: { id: element[field_name] },
            headers: {
              Authorization: ckan_token,
            },
          })
          .then((res) => {
            const tmp = res.data;
            const operate = { type: type, id: id, user: tmp.name, role: element.capacity };
            // operate內的名稱會連動到changeOperate方法
            return { name: tmp.name, email: tmp.email, capacity: element.capacity, operate: operate };
          })
          .catch((e) => {
            console.error(e);
            return { name: "", email: "" };
          });
      })
    );
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
        <VisualTable field={field} data={members} operate={changeOperate} />
      </div>
    </>
  );
}
function changeOperate(memberInfo) {
  // type:organization/dataset,
  // id:(org/set)'s id,
  // name:user's name,
  // role:original role
  const roleList = [
    { id: 0, value: "admin", display: "admin" },
    { id: 1, value: "editor", display: "editor" },
    { id: 2, value: "member", display: "member" },
  ];
  async function sendChange() {
    await axios.post({});
  }
  return (
    <div>
      <font>權限變更-{memberInfo.id}</font>
      <font>{memberInfo.user}</font>
      <font>目前權限:{memberInfo.role}</font>
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
      <div>
        <button>cancel</button>
        <button
          onClick={() => {
            sendChange();
          }}
        >
          change
        </button>
      </div>
    </div>
  );
}
