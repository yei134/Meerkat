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
      resources.map((element) => {
        if (formatCount[element.format] === undefined) {
          if (element.format === "") {
            element.format = "Unknow";
          }
          setFormatCount((prev) => {
            prev[element.format] = 1;
            return prev;
          });
        } else {
          setFormatCount((prev) => {
            prev[element.format] += 1;
            return prev;
          });
        }
      });
    }
  }, [datasetInfo]);

  return (
    <div className="append-left">
      <div className="left-head">資料集名稱</div>
      <div className="ds-name">{datasetInfo.name}</div>
      <div className="left-head">所屬組織</div>
      <div>
        <img src={orgInfo.imgUrl} alt={orgInfo.title} />
      </div>
      <div className="ds-org">{orgInfo.title}</div>
      <div className="left-head">附件結構</div>
      <div className="ds-fieformat">
        {Object.entries(formatCount).map((element) => {
          return (
            <p key={`fileFormat_${element}`}>
              <img src={`../../file${element[0]}.svg`} alt={`${element[0]}`} />:{element[1]}
              <br />
            </p>
          );
        })}
      </div>
    </div>
  );
}
