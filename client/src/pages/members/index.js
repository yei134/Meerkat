// 套件
import axios from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
// 檔案
import "./index.css";
import VisualTable from "../../components/visualTable";
import { ckan_default, ckan_token } from "../../global/constants";

export default function Members() {
  // 網頁跳轉涵式
  const navigate = useNavigate();
  // 取得keycloak資訊
  const { keycloak } = useKeycloak();
  // 使用者keycloak資訊
  const [userInfo, setUserInfo] = useState({});
  // 有權限的org列表
  const [orgList, setOrgList] = useState([]);
  // 有權限的pkg列表
  const [pkgList, setPkgList] = useState([]);
  // 可操作列表(orgnization[org]+package[pkg])
  const [operationList, setOperationList] = useState([]);
  // 成員資料
  const [members, setMembers] = useState([]);
  // 權限變更
  const [roleChange, setRoleChange] = useState({});
  // 欄位
  const field = [
    { id: 1, name: "index", display: "No." },
    { id: 2, name: "name", display: "Name" },
    { id: 3, name: "email", display: "E-mail" },
    { id: 4, name: "capacity", display: "Role" },
  ];

  // 1.首次刷新時，取得使用者登入資訊
  useEffect(() => {
    getUserInfo();
  }, []);
  // 1.1.取keycloak中的user資料
  async function getUserInfo() {
    await keycloak
      .loadUserProfile()
      .then((res) => {
        setUserInfo(res);
      })
      .catch((e) => {
        console.log(e);
        alert("登入錯誤");
        navigate("/");
      });
  }
  // 2.當使用者資料更新時，取得操作列表
  useEffect(() => {
    if (userInfo.email !== undefined) {
      getOperationList();
    }
    setOperationList([]);
    setOrgList([]);
    setPkgList([]);
    setMembers([]);
    setRoleChange({});
  }, [userInfo]);
  // 2.1.取得使用者可操作列表(orgnization[org]+package[pkg])
  async function getOperationList() {
    // 待補：透過saml取得user在ckan的name
    let userName = userInfo.email.split("@")[0];
    userName = userName.replace(".", "-");
    // A. 組織可操作列表取得
    getOrgPkgList(userName);
    // B. 資料集可操作列表取得
    getPkgList(userName);
  }
  // A. 取得組織資料集列表
  async function getOrgPkgList(userName) {
    // A1. 取得使用者所在的所有組織(org)和組織身分
    let getOrgList = await getCkanApiOrgListForUser(userName);
    // A2. 篩選組織出身分為admin的組織
    getOrgList = filterAdminCapacityList(getOrgList);
    // A2.1. 儲存組織列表
    setOrgList(getOrgList);
    // A3. 取得組織內所有的資料集列表
    let getPkgListOrg = getOrgPkgList();
    // 3. 篩選出符合格式的資料集(package)
    getPkgListOrg = filterFormatPkgList(getPkgListOrg);
    // 4. 放入pkgList並避免重複
    putInPkgList(getPkgListOrg);
  }
  // B. 取得單獨資料集列表
  async function getPkgList(userName) {
    // B1. 取得所在的資料集列表
    let getPkgListPkg = await getCkanApiCollaboratorListForUser(userName);
    // B2. 篩選出身分為admin的資料集
    getPkgListPkg = filterAdminCapacityList(getPkgListPkg);
    // 3. 篩選出符合格式的資料集(package)
    getPkgListPkg = filterFormatPkgList(getPkgListPkg);
    // 4. 放入pkgList並避免重複
    putInPkgList(getPkgListPkg);
  }
  // A1. 取得使用者所在的所有組織(org)和組織身分
  async function getCkanApiOrgListForUser(userName) {
    const getOrgList = await axios
      .get(`${ckan_default}api/ckan/organization_list_for_user`, {
        params: { id: userName },
        headers: {
          Authorization: ckan_token,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
    return getOrgList;
  }
  // A2.&B2. 篩選組織出身分為admin的組織
  function filterAdminCapacityList(getList) {
    const adminList = getList.filter((ele) => ele.capacity === "admin");
    return adminList;
  }
  // A3. 取得組織內所有的資料集列表
  async function getOrgPkgList() {
    const orgPkgList = await new Promise(() => {
      orgList.map((element) => {
        return getCkanApiOrgPkgList(element.id);
      });
    });
    async function getCkanApiOrgPkgList(orgId) {
      const res = await axios
        .get(`${ckan_default}api/ckan/organization_package_list`, {
          params: { id: orgId },
          headers: {
            Authorization: ckan_token,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((e) => {
          console.log(e);
          return [];
        });
      return res;
    }
    console.log(orgPkgList);
  }
  // B1. 取得所在的資料集列表
  async function getCkanApiCollaboratorListForUser(userName) {
    const getPkgList = await axios
      .get(`${ckan_default}api/ckan/collaborator_list_for_user`, {
        params: { id: userName },
        headers: {
          Authorization: ckan_token,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
    return getPkgList;
  }
  // 3. 篩選出符合格式的資料集(package)
  function filterFormatPkgList(getPkgList) {
    const formatList = getPkgList.lenth === 0 ? getPkgList.filter((pack) => pack.name.includes("-type-private")) : [];
    return formatList;
  }
  // 4. 放入pkgList並避免重複
  function putInPkgList(getPkgList) {
    getPkgList.map((element) => {
      if (!pkgList.filter((pack) => pack.id.includes(element.id))) {
        setPkgList((prev) => {
          return [...prev, element];
        });
      }
    });
  }
  // 5. 合併pkgList和orgList
  useEffect(() => {
    setOperationList(() => {
      return [...orgList, ...pkgList];
      // return { organization: orgList, dataset: pkgList };
    });
  }, [orgList, pkgList]);

  // 取得選取範圍org/dataset內的成員
  async function getMembers(type, name) {
    let api = "";
    if (type === "organization") {
      api = `${ckan_default}api/ckan/organization_info`;
    } else if (type === "dataset") {
      api = `${ckan_default}api/ckan/collaborator_list`;
    }
    if (api !== "") {
      await axios
        .get(api, {
          params: { id: name },
          headers: {
            Authorization: ckan_token,
          },
        })
        .then(async (res) => {
          if (type === "organization") {
            const tmp = res.data.users;
            const memberInfo = await getCkanUser(tmp, "id", "organization", name);
            setMembers(memberInfo);
          } else if (type === "dataset") {
            const tmp = res.data;
            const memberInfo = await getCkanUser(tmp, "user_id", "dataset", name);
            setMembers(memberInfo);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
  // 取得ckan的user資訊 (type和name是為了表格操作放入的)
  async function getCkanUser(arr, field_name, type, name) {
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
            const operate = { type: type, name: name, user: tmp.name, role: element.capacity, display: true };
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

  return (
    <>
      {/* 操作選單 */}
      <div style={{ background: "#fff" }}>
        <ul>
          {operationList.map((element, index) => {
            return (
              <li
                key={`operationList_${index}`}
                onClick={() => {
                  getMembers(element.type, element.name);
                }}
              >{`${element.type}:  ${element.title}-${element.private}`}</li>
            );
          })}
        </ul>
      </div>
      <div>
        <VisualTable field={field} data={members} operate={setRoleChange} />
      </div>
      {/* 權限變換對話框 */}
      <ChangeOperate roleChange={roleChange} setRoleChange={setRoleChange} />
    </>
  );
}
function ChangeOperate({ roleChange, setRoleChange }) {
  // type:organization/dataset,
  // id:(org/set)'s name,
  // name:user's name,
  // role:original role
  const roleList = [
    { id: 0, value: "admin", display: "admin" },
    { id: 1, value: "editor", display: "editor" },
    { id: 2, value: "member", display: "member" },
  ];
  function closeChangeRole() {
    setRoleChange((prev) => {
      return {
        ...prev,
        display: false,
      };
    });
  }
  async function sendChange(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    let formJson = Object.fromEntries(formData.entries());
    let api = `${ckan_default}api/ckan`;
    if (roleChange.type === "dataset") {
      api += "/collaborator_edit";
    } else {
      api += "/organization_member_edit";
    }
    await axios
      .post(
        api,
        {
          id: roleChange.name,
          users: [roleChange.user],
          role: formJson.role,
        },
        {
          headers: {
            Authorization: ckan_token,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });
    setRoleChange((prev) => {
      return {
        ...prev,
        display: false,
      };
    });
  }
  return (
    <>
      {roleChange.display && (
        <form onSubmit={sendChange}>
          <>權限變更-{roleChange.name}</>
          <>{roleChange.user}</>
          <>目前權限:{roleChange.role}</>
          <>
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
          </>
          <div>
            <button
              type="button"
              onClick={() => {
                closeChangeRole();
              }}
            >
              cancel
            </button>
            <button type="submit">change</button>
          </div>
        </form>
      )}
    </>
  );
}
