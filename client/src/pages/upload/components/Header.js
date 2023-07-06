import React from "react";

export default function Header() {
  return (
    <header>
      <div>
        <img src="LOGO.svg" className="logo"></img>
        <h1>
          <a href="/datasetInfo/">Cerebral Hemorrhage DICOM Uploder</a>
        </h1>
      </div>

    </header>
  );
}