import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./Nav.css"

const Navbar =() => {
  const [navbarState, setNavbarState] = useState(false); //預設Navbar關起來
  const { keycloak, initialized } = useKeycloak();
  const keycloakData = keycloak.tokenParsed;
  console.log(keycloak.tokenParsed)
  var roletype = {};
  var username = {};
    if(keycloakData!=null){
      console.log(keycloakData);
      roletype=keycloakData.resource_access.react.roles[0];
      username=keycloakData.name
    }

  const changeHandler = () => {
    setNavbarState(!navbarState);
  }

  return (
    <>
      <nav className="navbar">
        <img src="./role1.svg"></img>
        {/* {navbarState} ? (
          <div className="div_navbar">

          </div>
        ) */}
        {/* <h3>{username}</h3> */}
        <div className="div_1">{roletype}</div>
        <ul>
          <li><button>申請記錄</button></li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar;