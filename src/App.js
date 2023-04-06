//載入套件
import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
//載入檔案
import Upload from "./pages/upload/index";
import ModelUpload from "./pages/ModelUpload/index";
import Header from "./components/Header";

// 介面所需框架集合
function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/fileUpload" element={<Upload/>}/>
          <Route path="/modelUpload" element={<ModelUpload/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
