import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function ConLeft({ datasetInfo }) {
  const [orgInfo, setOrgInfo] = useState({});
  // formatCount 計算各檔案類型數量
  const [formatCount, setFormatCount] = useState({});

  useEffect(() => {
    if (datasetInfo.organization !== undefined) {
      // 取得組織資訊
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/organization_info`, {
          params: { id: datasetInfo.organization.id },
          headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN },
        })
        .then((res) => {
          setOrgInfo({ imgUrl: res.data.image_display_url, title: res.data.title });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [datasetInfo]);

  // 計算資料集附件類別結構
  useEffect(() => {
    if (datasetInfo.resources !== undefined) {
      const resources = datasetInfo.resources;
      let formatCount_tmp = {};
      resources.map((element) => {
        // 將格式為空白的檔案設定為Unknow方便後面檔案圖示顯示
        if (element.format === "") {
          element.format = "Unknow";
        }
        // 判斷是否為病徵資料集
        if (element.name.split("_[type]_")[1] !== undefined) {
          return null;
        }
        // 計算各個類別個數
        if (formatCount_tmp[element.format] === undefined) {
          formatCount_tmp[element.format] = 1;
        } else {
          formatCount_tmp[element.format] += 1;
        }
      });
      setFormatCount(formatCount_tmp);
    }
  }, [datasetInfo]);

  return (
    <div className="append-left">
      <div className="left-head">資料集名稱</div>
      <div className="ds-name">
        <a href={`/datasetInfo/${datasetInfo.name}`}>{datasetInfo.title}</a>
      </div>
      <div className="left-head">所屬組織</div>
      <div>
        <img src={orgInfo.imgUrl} alt={orgInfo.title} />
      </div>
      <div className="ds-info">{orgInfo.title}</div>
      <div className="left-head">附件總數</div>
      <div className="ds-info">{datasetInfo.num_resources}</div>
      <div className="left-head">非病徵附件結構</div>
      <div className="ds-fieformat">
        {Object.entries(formatCount).map((element) => {
          //img src分類-依format分配icon
          let imgSrc = "";
          if (element[0] == "PDF") {
            imgSrc = "../../filePDF.svg";
          } else if (element[0] == "DOC") {
            imgSrc = "../../fileDOC.svg";
          } else if (element[0] == "PPTX") {
            imgSrc = "../../filePPTX.svg";
          } else if (element[0] == "TXT") {
            imgSrc = "../../fileTXT.svg";
          } else if (element[0] == "PNG") {
            imgSrc = "../../filePNG.svg";
          } else if (element[0] == "CSV") {
            imgSrc = "../../fileCSV.svg";
          } else {
            imgSrc = "../../fileUnknow.svg";
          }
          return (
            <p key={`fileFormat_${element}`}>
              <img src={imgSrc} alt={`${element[0]}`} />
              &nbsp; {element[0]}&nbsp;:{element[1]}
              <br />
            </p>
          );
        })}
      </div>
    </div>
  );
}
