import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <div className="background">
      <h1 className="h1">Cerebral Hemorrhage DICOM Uploder</h1>
      <div>
        <div className="App">
          <form>
            <input className="buttonFile" type="file" />
            <button type="submit">Upload</button>
          </form>
        </div>
        <button className="buttonFile">Slecect File</button>
        <button className="buttonFolder">Slecect Folder</button>
        <button className="buttonUpload">Upload All</button>
        <button className="buttonReset">Reset</button>
      </div>
    </div>
  );
}
