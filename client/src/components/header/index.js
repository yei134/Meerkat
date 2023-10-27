// 套件
import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import GitHubIcon from "@mui/icons-material/GitHub";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// 檔案
import "./index.css";

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
          <img src="/MeerkatTitle.svg" className="headerLeftLogo" />
        </a>
        {/* <a href="https://github.com/cylab-tw" target="_blank">
          <GitHubIcon sx={{ fontSize: "1.5rem", alignSelf: "flex-end", margin: "0.2rem" }} />
        </a>
        <a href="	https://data.dmc.nycu.edu.tw/" target="_blank">
          <img src="/NYCU_icon.png" alt="NYCU" className="otherIcon" />
        </a> */}
      </div>
      <div className="headerRight">
        {keycloak.authenticated ? (
          <>
            <button
              className="headerRightButton"
              onClick={() => {
                keycloak.logout();
              }}
            >{`Logout (${userInfo.email !== undefined ? userInfo.email.split("@")[0] : ""})`}</button>
            <a href="/members">
              <ManageAccountsIcon sx={{ fontSize: "1.8rem" }} />
            </a>
          </>
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
