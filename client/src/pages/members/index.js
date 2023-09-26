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
  const [data, setData] = useState([]);
  // 欄位
  const field = ["No.", "Name", "E-mail", "Role"];

  // 取keycloak中的user資料
  async function getUserInfo() {
    await keycloak
      .loadUserProfile()
      .then((res) => {
        setUserInfo(res);
        console.log("keycloak.loadUserProfile:", res);
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
        console.log("ckan.organization_list_for_user:", res);
        let tmp = [];
        res.data.map((element) => {
          if (element.capacity === "admin") {
            tmp.push(element);
          }
        });
        setOperationList(tmp);
      })
      .catch((e) => {
        console.log(e);
      });
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
            return (
              <li key={`operationList_${index}`}>{element.display_name}</li>
            );
          })}
        </ul>
      </div>
      <div>
        <VisualTable field={field} data={data} />
      </div>
    </>
  );
}
