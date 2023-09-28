import React, { useState } from "react";

const ConLeft = ({author, groupsName, createTime, modifiedTime, ownerOrg}) => {
  // const {title}=ownerOrg;
  // console.log(title);
  // console.log(groups);
  return (
    <div className="conleft"> 
      <div>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>作者</td>
              <td>{author}</td>
            </tr>
            <tr>
              <td>所屬群組</td>
              <td>{groupsName}</td>
            </tr>
            <tr>
              <td>組織</td>
              <td>{ownerOrg}</td>
            </tr>
            <tr>
              <td>
                病徵
              </td>
              <td>description</td>
            </tr>
            <tr>
              <td>創建時間</td>
              <td>{createTime}</td>
            </tr>
            <tr>
              <td>修改時間</td>
              <td>{modifiedTime}</td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConLeft;