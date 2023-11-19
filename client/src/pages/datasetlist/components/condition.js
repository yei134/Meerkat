//套件
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
//檔案
import Content from "./content";
//icon庫
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const Condition = (inputText) => {
  const [orglist, setOrglist] = useState(); //組織列表
  const [grouplist, setGrouplist] = useState(); //群組列表
  const [taglist, setTaglist] = useState(); //標籤列表
  const [condition, setCondition] = useState({
    //篩選條件參數
    name: "",
    type: "",
    id: "",
    URL: "",
  });
  const [datsetlist, setDatsetlist] = useState(); //顯示之資料集(全)
  const [distributedDatalist, setDistributedDatalist] = useState(); //顯示之資料集(每6個為一個陣列)
  const [isOrgListVisible, setOrgListVisible] = useState(false); //初始狀態把導覽列關起來
  const [isGroupListVisible, setGroupListVisible] = useState(false); //初始狀態把導覽列關起來
  const [isTagListVisible, setTagListVisible] = useState(false); //初始狀態把導覽列關起來
  const [pageNow, setPageNow] = useState(1); //當前頁數
  const dataSix = 6; //一頁顯示的資料筆數
  const [pagestotal, setPagestotal] = useState(); //總頁數
  const [datalistNow, setDatalistNow] = useState(); //目前頁數的資料-陣列-6個以內

  //=== 拿取orglist、grouplist、taglist資料 ===//
  useEffect(() => {
    const getOrglist = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_list`, { headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } }).then((response) => {
          let org = response.data;
          setOrglist(org);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getOrglist();

    const getGrouplist = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/group_list`, { headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } }).then((response) => {
          setGrouplist(response.data);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setGrouplist([]);
      }
    };
    getGrouplist();

    const getTaglist = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/tag_list`, { headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN } }).then((response) => {
          setTaglist(response.data);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setTaglist([]);
      }
    };
    getTaglist();
  }, []);

  //=== 當inputText或condition清空時，以searchQuery方式拿取datsetlist資料 ===//
  useEffect(() => {
    const searchQuery = inputText.inputText;
    const getDataset = async () => {
      try {
        axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_search`, {
            params: {
              limit: 1000, //不寫預設是10筆, 寫死一個較大的筆數
              searchQuery: searchQuery,
            },
            headers: {
              Authorization: process.env.REACT_APP_CKAN_TOKEN,
            },
          })
          .then((res) => {
            let dl = res.data.results;
            setDatsetlist(dl);
          });
      } catch (error) {
        console.error(error);
      }
    };
    if (condition.id == "") {
      getDataset();
    }
  }, [inputText, condition]);

  useEffect(() => {
    if (condition.id !== "" && condition.id !== undefined) {
      getDatasetList(condition);
      setPageNow(1);
    }
  }, [condition]);

  useEffect(() => {
    if (datsetlist !== undefined) {
      let pt = Math.ceil(datsetlist.length / dataSix);
      setPagestotal(pt);
      let ddl = chunkArray(datsetlist, dataSix);
      setDistributedDatalist(ddl);
      setPageNow(1);
      if (pageNow == 1) {
        let dln = ddl[pageNow - 1];
        setDatalistNow(dln);
      }
    }
  }, [datsetlist]);

  //=== 依照篩選條件去後端拿資料集 ===//
  function getDatasetList() {
    const getDataset = async () => {
      const id = condition.id;
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/${condition.URL}`, {
            params: {
              id: id,
            },
            headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN },
          })
          .then((res) => {
            let dl = res.data;
            setDatsetlist(dl);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (condition.id !== "" && condition.id !== undefined) {
      getDataset();
    }
  }

  //=== 更改篩選條件資料-organization類 ===//
  function handleConditionOrgChange(e) {
    setCondition({
      ...condition,
      name: "Organizations",
      type: "orgID",
      id: e,
      URL: "organization_package_list",
    });
  }

  //=== 更改篩選條件資料-group類 ===//
  function handleConditionGroupChange(e) {
    setCondition({
      ...condition,
      name: "Groups",
      type: "groupID",
      id: e,
      URL: "group_package_list",
    });
  }

  //=== 更改篩選條件資料-tag類 ===//
  function handleConditionTagChange(e) {
    setCondition({
      ...condition,
      name: "Tags",
      type: "tagID",
      id: e,
      URL: "tag_package_list",
    });
  }

  //=== 取消篩選條件 ===//
  function cancelCondition() {
    setCondition({
      name: "",
      type: "",
      id: "",
      URL: "",
    });
    getDatasetList();
  }

  //=== 監聽orglist ===//
  const orglistStateChange = () => {
    setOrgListVisible(!isOrgListVisible); //改變orglist狀態(開/關)
    setGroupListVisible(false);
    setTagListVisible(false);
  };
  //=== 監聽grouplist ===//
  const grouplistStateChange = () => {
    setGroupListVisible(!isGroupListVisible); //改變grouplist狀態(開/關)
    setOrgListVisible(false);
    setTagListVisible(false);
  };
  //=== 監聽taglist ===//
  const taglistStateChange = () => {
    setTagListVisible(!isTagListVisible); //改變taglist狀態(開/關)
    setOrgListVisible(false);
    setGroupListVisible(false);
  };

  //=== 監聽下一頁button ===//
  const plusPageChange = () => {
    if (pageNow < pagestotal) {
      let pn = pageNow + 1;
      setPageNow(pn);
      let dln = distributedDatalist[pn - 1];
      setDatalistNow(dln);
    }
  };
  //=== 監聽上一頁button ===//
  const minusPageChange = () => {
    if (pageNow > 1) {
      let pn = pageNow - 1;
      setPageNow(pn);
      let dln = distributedDatalist[pn - 1];
      setDatalistNow(dln);
    }
  };

  //=== 將拿到的datasetlist做資料處理，每{chunkSize}個值裝進一個二維陣列 ===//
  function chunkArray(arr, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }

  return (
    <>
      <div className="condition">
        {/* 新建資料集 */}
        <div>
          <button className="dataset-conditioin-newdataset">
            <a href="newDataset" className="pick-condition-title">
              <AddIcon />
              新建資料集
            </a>
          </button>
        </div>
        {/* org下拉 */}
        <div>
          <div className="condition-list-div">
            <button onClick={orglistStateChange} className="icon-button">
              {!isOrgListVisible && (
                <div>
                  <KeyboardArrowRightIcon />
                </div>
              )}
              {isOrgListVisible && (
                <div>
                  <KeyboardArrowDownIcon />
                </div>
              )}
            </button>
            <font className="package-condition-title">Organizations</font>
          </div>
          <div>
            {orglist && isOrgListVisible && (
              <div>
                {orglist.map((element, index) => {
                  return (
                    <button className="package-condition-item" value={element} key={index} onClick={() => handleConditionOrgChange(element)}>
                      <BookmarkIcon />
                      <div>{element}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* group下拉 */}
        <div>
          <div className="condition-list-div">
            <button onClick={grouplistStateChange} className="icon-button">
              {!isGroupListVisible && (
                <div>
                  <KeyboardArrowRightIcon />
                </div>
              )}
              {isGroupListVisible && (
                <div>
                  <KeyboardArrowDownIcon />
                </div>
              )}
            </button>
            <div className="package-condition-title">Groups</div>
          </div>
          <div>
            {grouplist && isGroupListVisible && (
              <div>
                {grouplist.map((element, index) => {
                  return (
                    <button className="package-condition-item" value={element} key={index} onClick={() => handleConditionGroupChange(element)}>
                      <BookmarkIcon />
                      <div>{element}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* tag下拉 */}
        <div>
          <div className="condition-list-div">
            <button onClick={taglistStateChange} className="icon-button">
              {!isTagListVisible && (
                <div>
                  <KeyboardArrowRightIcon />
                </div>
              )}
              {isTagListVisible && (
                <div>
                  <KeyboardArrowDownIcon />
                </div>
              )}
            </button>
            <div className="package-condition-title">Tags</div>
          </div>
          <div>
            {taglist && isTagListVisible && (
              <div className="">
                {taglist.map((element, index) => {
                  return (
                    <button className="package-condition-item" value={element} key={index} onClick={() => handleConditionTagChange(element)}>
                      <BookmarkIcon />
                      <div>{element}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="package-condition-font">
          <KeyboardDoubleArrowDownIcon />
          <font>展開選擇篩選條件</font>
          <KeyboardDoubleArrowDownIcon />
        </div>
      </div>
      {/* 上一頁 */}
      <div className="icon-button-container">
        <button className="icon-button" title={"上一頁"}>
          <ArrowBackIosNewIcon onClick={minusPageChange} />
        </button>
      </div>
      <div className="datasetlist-conright-container">
        <div>
          {!condition.id && datsetlist && (
            <div className="right-condition-nav">
              <div className="right-condition-container">
                <font className="pick-condition-title">
                  <FilterAltIcon></FilterAltIcon>
                  篩選條件&nbsp;-&nbsp;All
                </font>
              </div>
              <div>
                <font className="data-amount-div">共篩出&nbsp;{datsetlist.length}筆&nbsp;資料集</font>
              </div>
            </div>
          )}
          {condition.id && datsetlist && (
            <div className="right-condition-nav">
              <div className="right-condition-container">
                <font className="pick-condition-title">
                  <FilterAltIcon></FilterAltIcon>
                  篩選條件&nbsp;-&nbsp;{condition.name}
                </font>
                <div className="pick-conditon-div">
                  {condition.id}
                  <button className="cancel-button">
                    <CloseIcon onClick={cancelCondition}></CloseIcon>
                  </button>
                </div>
              </div>
              <div>
                <font className="data-amount-div">共篩出&nbsp;{datsetlist.length}筆&nbsp;資料集</font>
              </div>
            </div>
          )}
        </div>
        <hr className="dataset-list-hr" />
        <div className="package-list-container">
          {datalistNow && (
            <div className="package-list-div-style">
              {datalistNow.map((element) => {
                return <Content dataset={element} key={element.id} />;
              })}
            </div>
          )}
        </div>
        <hr className="dataset-list-hr" />
        <div className="pageAmount">
          <font className="data-amount-div">
            {pageNow}&nbsp;/共{pagestotal}頁&nbsp;
          </font>
        </div>
      </div>
      <div className="icon-button-container">
        <button className="icon-button" title={"下一頁"}>
          <ArrowForwardIosIcon onClick={plusPageChange} />
        </button>
      </div>
    </>
  );
};
export default Condition;
