import React, { useState } from "react";
const ConRight = ({ resources, selectedItems, setSelectedItems }) => {
    // 若資源(resources)為空，則不顯示內容，返回 null
  if (!resources) {
    return null;
  }
  let visibleindex=0;
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
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
        
          {resources.map((resource, index) => {
            const fileName = resource.name;
            const format = resource.format;
            const displayedFileName = `${fileName}.${format}`;
            const downloadUrl = resource.url;
            const isChecked = selectedItems.includes(resource.id);
              // 如果格式為 "CSV"，則不顯示
            if (format === "CSV") {
              return null;
            }
            visibleindex++;
            return (
              <tr key={index}>
                <td>{visibleindex}</td>
                <td>{fileName}</td>
                <td>{(resource.size / (1024 * 1024)).toFixed(1)}MB</td>
                <td>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => handleCheckboxChange(event, resource.id)}
                  />
                  <a href={downloadUrl} download={displayedFileName}>
                    Download
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
//resources.map((resource, index) => { ... })map 函式，用於對 resources 陣列中的每個元素進行處理。resource->正在處理的資源物件，index->在陣列中的索引。
export default ConRight;
