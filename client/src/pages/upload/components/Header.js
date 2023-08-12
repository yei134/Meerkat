import React from "react";

export default function Header() {
  return (
    <header>
      <h1>
        <img src="LOGO.svg" className="logo"></img>
        <a href="/datasetInfo/">Cerebral Hemorrhage DICOM Uploder</a>
      </h1>
    </header>
  );
}