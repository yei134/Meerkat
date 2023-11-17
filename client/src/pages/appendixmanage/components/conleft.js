import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function ConLeft({ datasetInfo }) {
  console.log(datasetInfo);
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
          console.log(res);
          setOrgInfo({ imgUrl: res.data.image_display_url, title: res.data.title });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [datasetInfo]);
  console.log(datasetInfo);
  return (
    <div className="append-left">
      <div>所屬組織</div>
      <div>
        <img src={orgInfo.imgUrl} alt={orgInfo.title} />
      </div>
      <div>{orgInfo.title}</div>
    </div>
  );
}
