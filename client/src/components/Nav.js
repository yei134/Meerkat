import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./Nav.css"

const Nav = () => {
 const { keycloak, initialized } = useKeycloak();
 console.log(JSON.stringify(keycloak.tokenParsed));

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
     {/* <div className="top-0 w-full flex flex-wrap">
       <section className="x-auto">
         <nav className="flex justify-between bg-gray-200 text-blue-800 w-screen">
           <div className="px-5 xl:px-12 py-6 flex w-full items-center">
             <h1 className="text-3xl font-bold font-heading">
               Keycloak React AUTH.
             </h1>
             <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
               <li>
                 <a className="hover:text-blue-800" href="/">
                   Home
                 </a>
               </li>
               <li>
                 <a className="hover:text-blue-800" href="/protect">
                   Secured Page
                 </a>
               </li>
             </ul>
             <div className="hidden xl:flex items-center space-x-5">
               <div className="hover:text-gray-200">
               <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.login()}
                   >
                     Login
                   </button>
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.logout()}
                   >
                     Logout ({keycloak.tokenParsed})
                   </button>
                 {!keycloak.authenticated && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.login()}
                   >
                     Login
                   </button>
                 )}
                  {!!keycloak.authenticated && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.logout()}
                   >
                     Logout ({keycloak.tokenParsed.preferred_username})
                   </button>
                 )}
               </div>
             </div>
           </div>
         </nav>
       </section>
     </div> */}
   </div>
 );
};

export default Nav;
