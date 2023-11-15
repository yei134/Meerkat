// A1. 取得使用者所在的所有組織(org)和組織身分
async function getCkanApiOrgListForUser() {
  await axios
    .get(`${ckan_default}api/ckan/organization_list_for_user`, {
      params: { id: userName },
      headers: {
        Authorization: ckan_token,
      },
    })
    .then((res) => {
      setOrgList(res.data);
    })
    .catch((e) => {
      console.log(e);
      setOrgList([]);
    });
}
// A2. 篩選組織出身分為admin的組織
function filterAdminCapacityOrgList() {
  const adminList = orgList.filter((org) => org.capacity === "admin");
  setOrgList(adminList);
}
/*adminList.map((element) => {
    // 取得組織裡的所有資料集
    getOrgPackageList(element.id);
  }); */
// A3. 取得組織內所有的資料集列表
async function getOrgPackList() {
  const orgPackList = await new Promise(() => {
    let resList = [];
    orgList.map((element) => {
      resList.push(...getCkanApiOrgPackList(element.id));
    });
    return resList;
  });
  async function getCkanApiOrgPackList(orgId) {
    await axios
      .get(`${ckan_default}api/ckan/organization_package_list`, {
        params: { id: orgId },
        headers: {
          Authorization: ckan_token,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
  }
}
// 3. 篩選出符合格式的資料集(package)
function filterFormatPackList(getPackList) {
  const formatList = getPackList.filter((pack) => pack.name.includes("-type-private"));
  return formatList;
}
// 4. 放入packList並避免重複
function putInPackList(getPackList) {
  getPackList.map((element) => {
    if (!packList.filter((pack) => pack.id.includes(element.id))) {
      setPackList((prev) => {
        return [...prev, element];
      });
    }
  });
}
