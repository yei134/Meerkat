import React, { useState } from "react";

const ConLeft = ({name, private_dataset, groups, ownerOrg, description}) => {
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
              <td>name</td>
            </tr>
            <tr>
              <td>所屬群組</td>
              <td>{groups}</td>
            </tr>
            <tr>
              <td>組織</td>
              <td>{ownerOrg}</td>
            </tr>
            <tr>
              <td>
                病徵
              </td>
              <td>{description}</td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConLeft;