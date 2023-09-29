import React from "react";
import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./Nav.css"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Nav = () => {
 const { keycloak, initialized } = useKeycloak();
 const roletype = keycloak.tokenParsed;
 
 var role={};
//  console.log(typeof(roletype1))
  if(roletype!=null){
    console.log(roletype.email);
    role=roletype.resource_access.react.roles[0];
  }
  console.log(role);
//  const roletype1 = roletype.map((resource)=>resource.resource_access);
//  roletype1=roletype.resource_access;
//  console.log(roletype1);
// files=packageDataInfo.resources.map((resource)=>resource.name);

 return (
   <div className="div_nav">
    {/* 沒有權限時 */}
    {/* {!keycloak.authenticated && (
      <button type="button" onClick={() => keycloak.login()} className="button_nav">
        Login
      </button>
    )} */}
    {/* 有權限時 */}
    {/* {keycloak.authenticated && (
      <button type="button" onClick={() => keycloak.logout()} className="button_nav">
        Logout ({keycloak.tokenParsed.preferred_username})
      </button>
    )} */}
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" component="div">
          Photos
        </Typography>
      </Toolbar>
    </AppBar>
   </div>
 );
};

export default Nav;
