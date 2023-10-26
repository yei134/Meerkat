import { createContext, useState } from 'react';
import { useKeycloak } from "@react-keycloak/web";

// 創建上下文
export const AuthContext = createContext();

// 創建provider組件
export const AuthProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const token = keycloak.tokenParsed;
  var org={};
  var email={};
  if(token != null){
    console.log(token.organization[0]);
    org = token.organization[0];
    email = token.email;
  }
  const [userOrg, setUserOrg ] = useState(org);
  // const [userRole, setUserRole] = useState('datasetUser');
  //1：dataset_user 2：dataset_manager 3:platform_manager
  //改成從keycloak拉到的值
  const [userEmail, setUserEmail] = useState(email);
  //手腳X-Ray (類風溼關節炎)的email
  console.log(typeof(userOrg));

  return (
    <AuthContext.Provider value={{ userOrg, setUserOrg, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};