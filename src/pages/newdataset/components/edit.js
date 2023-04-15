import { useState } from "react";
import { v4 } from "uuid";

const Edit = ({ add, submittingState }) => {
  //新增資料集畫面需要的參數
  const [name, setName] = useState("");//package_create name (資料集英文名稱 用來當檔案名的 不可有空白 數字開頭
  const [title, setTitle] = useState("")//package_create title(資料集的名字 可以中文
  const [note, setNote] = useState("");//package_create note(說明
  const [private_dataset, setPrivate] = useState(false);//package_create private(是否對外公開 如果不要對外公開要有組織
  const [groups, setGroups] = useState("");//package_create groups(屬於哪一類群組 如腦部 肺部
  const [ownerOrg, setOwnerOrg] = useState(null);//package_create owner_org(組織 例如北榮 北護

  //newDataset介面
  function nameChange(e){
    setName(e.target.value);
  }
  function titleChange(e){
    setTitle(e.target.value);
  }
  function noteChange(e){
    setNote(e.target.value);
  }
  function privateChange(e){
    setPrivate(e.target.value);
  }
  function groupsChange(e){
    setGroups(e.target.value);
  }
  function ownerOrgChange(e){
    setOwnerOrg(e.target.value);
  }

  //範例
  // function addMatter() { 
  //   submittingState.current = true;  
  //   add(function (prev) {
  //     return [
  //       ...prev,
  //       {
  //         id: v4(),
  //         matter,
  //         date,
  //         time,
  //       },
  //     ];
  //   });
  // }

  function handleSubmit(event) {
    alert('An essay was submitted: ');
    event.preventDefault();
  }

  return (
    <div className="newDatasetDiv">
      <h1>資料集新增</h1>
      <form onSubmit={handleSubmit}>
        {/* 填寫區域 */}
        <label>
          *名稱：
          <input type="text" value={name} onChange={nameChange} className="textbox" />
        </label>
        <p/>
        <label>
          *標題：
          <input type="text" value={title} onChange={titleChange} className="textbox"/>
          <div>(需英文且不可有空白)</div>
        </label>
        <hr></hr>
        <label>
          說明：
          <textarea value={note} onChange={noteChange} />
        </label>
        <label>
          <input type="checkbox" value={false}></input>
          公開
        </label>
        <label>
          所屬群組
          <select id="groups" name="groups">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>
        </label>
        {/* 操作按鈕 */}
        <div>
          <button type="submit" className="add">
              Submit
            </button>
            <button type="reset" className="add">
              Reset
            </button>
            <button className="add">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
