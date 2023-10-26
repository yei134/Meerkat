import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();

  const isLoggedIn = keycloak.authenticated;
  //  console.log(isLoggedIn ? children : null);
  // console.log("children="+children);
  // console.log(isLoggedIn);
  // console.log(keycloak.authenticated);
  return isLoggedIn ? children : null;
};

export default PrivateRoute;
