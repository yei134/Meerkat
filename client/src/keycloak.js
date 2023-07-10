import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "http://140.131.93.163:28080/auth",
 realm: "Meerkat",
 clientId: "react",
});

export default keycloak;

// 進入keycloak的網址：http://140.131.93.163:28080/
