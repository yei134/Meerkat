import { useKeycloak } from "@react-keycloak/web";
import "./index.css";
import { useState } from "react";
export default function Header() {
  const { keycloak } = useKeycloak();
  const [userInfo, setUserInfo] = useState({});
  if (keycloak.authenticated) {
    getUserInfo();
  }
  async function getUserInfo() {
    const tmp = await keycloak
      .loadUserProfile()
      .then((res) => {
        setUserInfo(res);
      })
      .catch((e) => {
        console.error(e);
      });
  }
  return (
    <div className="header">
      <div className="headerLeft">
        <a href="/">
          <img src="/LOGO.svg" className="headerLeftLogo" />
        </a>
      </div>
      <div className="headerRight">
        {keycloak.authenticated ? (
          <button
            className="headerRightButton"
            onClick={() => {
              keycloak.logout();
            }}
          >{`（${
            userInfo.email !== undefined ? userInfo.email.split("@")[0] : ""
          }）Logout`}</button>
        ) : (
          <button
            className="headerRightButton"
            onClick={() => {
              keycloak.login();
            }}
          >{`Login`}</button>
        )}
      </div>
    </div>
  );
}
