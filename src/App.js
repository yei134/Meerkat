import React from "react";
import Upload from "./pages/upload/";
import Content from "./pages/upload/components/Content";
import './index.css'  
    
// 介面所需框架集合
function App() {
  return (
    <div>
      <Upload />
      <Content />       
    </div>
  );
}

export default App;