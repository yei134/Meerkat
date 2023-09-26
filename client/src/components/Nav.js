import React from "react";
import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./Nav.css";

const Nav = () => {
 const { keycloak, initialized } = useKeycloak();
//  const roletype = keycloak.tokenParsed;
//  var role={};
//  console.log(typeof(roletype1))
  // if(roletype!=null){
  //   console.log(roletype.email);
  //   role=roletype.resource_access.react.roles[0];
  // }
  console.log(keycloak);

 return (
   <div className="div_nav">
    {/* 沒有權限時 */}
    {!keycloak.authenticated && (
      <button type="button" onClick={() => keycloak.login()} className="button_nav">
        Login
      </button>
    )}
    {/* 有權限時 */}
    {keycloak.authenticated && (
      <button type="button" onClick={() => keycloak.logout()} className="button_nav">
        Logout ({keycloak.tokenParsed.preferred_username})
      </button>
    )}
   </div>
 );
};

export default Nav;
