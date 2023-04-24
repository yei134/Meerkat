import React from "react";

const ConLeft = () => {
  return (
    <div className="left">
      <span>
        <h2>datasetTitle</h2>
        <hr/>
        <table>
          <thead>
            <tr>
              <th>作者</th>
              <th>name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>最後更新</td>
              <td>uploadDate</td>
            </tr>
            <tr>
              <td>創建日期</td>
              <td>buildDate</td>
            </tr>
            </tbody>
        </table>
      </span>
    </div>
  );
};

export default ConLeft;