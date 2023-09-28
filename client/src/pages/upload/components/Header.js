import React from "react";

export default function Header() {
  return (
    <header>
      <h1>
        <a href="/"><img src="../../LOGO.svg" className="logo"></img></a>
        <a href="/">Cerebral Hemorrhage DICOM Uploder</a>
      </h1>
    </header>
  );
}