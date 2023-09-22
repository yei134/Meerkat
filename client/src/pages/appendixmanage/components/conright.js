import React, { useState,useEffect } from "react";
const ConRight = ({ resources, selectedItems, setSelectedItems ,}) => {
 
  
  
    // 若資源(resources)為空，則不顯示內容，返回 null
  if (!resources) {
    return null;
  }
  let visibleindex=0;
  
  // const handleDownload = (downloadUrl, fileName) => {
  //   const link = document.createElement('a');
  //   link.href = downloadUrl;
  //   link.download = fileName;
  //   link.click();
  // };
    //勾選框事件
  const handleCheckboxChange = (event, resourceId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
        // 如果勾選框被勾選，將(resourceId)加入(selectedItems)
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, resourceId]);
    } else {
      // 如果勾選框被取消勾選，將ID(resourceId)從(selectedItems)中移除
      //如果 item 與 resourceId 不相等，表示不是要移除的ID，它將會被保留在新陣列中。
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== resourceId)
      );
    }
    console.log("Checkbox checked:", isChecked);
    console.log("Selected resourceId:", resourceId); // 在console中顯示資源的ID
  };
  
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>NO.</th>
            <th>FileName</th>
            <th>FileSize</th>
            {/* <th>Description</th> */}
            <th>Created Time</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
        
          {resources.map((resources, index) => {
            const utcTime = new Date(resources.created); // 假設 resources.created 是 UTC 時間
            const gmtPlus8Time = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000); // 轉換成 GMT+8 時區的時間
            const fileName = resources.name;
            // const description = resources.description || "NULL"; // 如果 description 沒有值，顯示 "NULL"
            const timeOptions = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true,  timeZone: "Asia/Taipei", // 設定時區為台北時區
          };
          const formattedTime = gmtPlus8Time.toLocaleString("zh-TW", timeOptions);
          const format = resources.format;
            const displayedFileName = `${fileName}.${format}`;
            // const downloadUrl = resources.url;
            const isChecked = selectedItems.includes(resources.id);
            if (format === "CSV") {
            if(displayedFileName.includes("_[type]_"))
            {
               return null;
            }
          }
            visibleindex++;
            return (
              <tr key={index}>
                <td>{visibleindex}</td>
                <td>{fileName}</td>
                <td>{(resources.size / (1024*1024)).toFixed(1)}MB</td>
                {/* <td>{description}</td> */}
                <td>{formattedTime}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => handleCheckboxChange(event, resources.id)}
                  />
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
