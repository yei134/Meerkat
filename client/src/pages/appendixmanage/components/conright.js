import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import VisualTable from "../../../components/visualTable";

const ConRight = ({ resources, selectedItems, setSelectedItems }) => {
  // 若資源(resources)為空，則不顯示內容，返回 null
  if (!resources) {
    return null;
  }
  let visibleindex = 0;

  //勾選框事件
  const handleCheckboxChange = (event, resourceId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      // 如果勾選框被勾選，將(resourceId)加入(selectedItems)
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, resourceId]);
    } else {
      // 如果勾選框被取消勾選，將ID(resourceId)從(selectedItems)中移除
      //如果 item 與 resourceId 不相等，表示不是要移除的ID，它將會被保留在新陣列中。
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((item) => item !== resourceId));
    }
  };

  return (
    <>
      {/* 路徑 */}
      {/* <div className="route">
        <HomeIcon />
        <a href="/">&nbsp;資料集列表&nbsp;&nbsp;</a>/
        <a href={`/datasetInfo/${name}`} className="page">
          &nbsp;&nbsp;{title}
        </a>
      </div> */}
      <table className="append-right-list">
        <thead>
          <tr>
            <th>NO.</th>
            <th>FileName</th>
            <th>FileSize</th>
            {/* <th>description</th> */}
            <th>Created Time</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resources, index) => {
            const utcTime = new Date(resources.created); // 假設 resources.created 是 UTC 時間
            const gmtPlus8Time = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000); // 轉換成 GMT+8 時區的時間
            const fileName = resources.name;
            const timeOptions = {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZone: "Asia/Taipei", // 設定時區為台北時區
            };
            const formattedTime = gmtPlus8Time.toLocaleString("zh-TW", timeOptions);
            // 顯示檔名
            const format = resources.format;
            const displayedFileName = `${fileName}.${format}`;
            const isChecked = selectedItems.includes(resources.id);
            // 不顯示csv以及篩選特殊病徵
            if (format === "CSV" || format === "") {
              // 確認是否為特定檔案格式: datasetName_[type]_symptoms
              const haveSymptem = displayedFileName.split("_[type]_").length > 1 ? true : false;
              if (haveSymptem) {
                return null;
              }
            }
            visibleindex++;
            return (
              <tr key={index}>
                <td>{visibleindex}</td>
                <td>{fileName}</td>
                <td>{(resources.size / (1024 * 1024)).toFixed(1)}MB</td>
                {/* <td>{resources.description}</td> */}
                <td>{formattedTime}</td>
                <td>
                  <input type="checkbox" checked={isChecked} onChange={(event) => handleCheckboxChange(event, resources.id)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default ConRight;
