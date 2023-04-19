import { useState } from "react";

const Edit = ({ add, submittingState, dataset}) => {
  //新增資料集畫面需要的參數
  const [name, setName] = useState("");//package_create name (資料集英文名稱 用來當檔案名的 不可有空白 數字開頭
  const [title, setTitle] = useState("")//package_create title(資料集的名字 可以中文
  const [note, setNote] = useState("");//package_create note(說明
  const [private_dataset, setPrivate] = useState(false);//package_create private(是否對外公開 如果不要對外公開要有組織
  const [groups, setGroups] = useState("");//package_create groups(屬於哪一類群組 如腦部 肺部
  const [ownerOrg, setOwnerOrg] = useState("");//package_create owner_org(組織id 例如25188a0c-7f13-4562-a5e2-042df726de3c
  
  //newDataset's label change
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

  //newDatasetform's button change
  function btn_submit(){
    submittingState.current = true;
    add(function () {
      return [
        {
          name,
          title,
          note,
          private_dataset,
          groups:{name:groups},
          ownerOrg,
        },
      ];
    });
  }
  function btn_reset(){
    setName("")
    setTitle("")
    setNote("")
    setPrivate(false)
    setGroups("")
    setOwnerOrg("")
  }
  function btn_cancel(){
    //待補:等其他頁面出來後
    alert("確認取消？");
    btn_reset();
    btn_submit();
  }

  return (
    <div className="newDatasetDiv">
      <h1>資料集新增</h1>
      <form onSubmit={btn_submit}>
        {/* 填寫區域 */}
        <label>
          <span>*名字：(需英文且不可有空白)&nbsp;&nbsp;</span>
          <input 
            type="text" 
            value={name} 
            onChange={nameChange}
            placeholder="需英文且不可有空白" 
            className="textbox titleBox"/>
        </label>        
        <p/>
        <label>
          <span>*標題：</span>
          <input
            type="text" 
            value={title} 
            onChange={titleChange} 
            className="textbox nameBox" />
        </label>
        <hr></hr>
        <label>
          <div>說明：</div>
          <textarea value={note} onChange={noteChange} />
        </label>
        <label>
          <div>
            <span><input type="checkbox" value={private_dataset} onChange={privateChange}/></span>
            公開
          </div>
        </label><p/>
        <label>{/*需要改成可以從ckan端取得資料*/}
          <span>所屬群組&nbsp;</span>
          <select id="groups" name="groups" value={groups} onChange={groupsChange}>
            <option value=""></option>
            <option value="ai-model">AI Model</option>
            <option value="biosignal">Bio-Signal</option>
            <option value="brain-image">Brain Image</option>
            <option value="digital-pathology">Digital Pathology</option>
            <option value="drone">Drone</option>
            <option value="genomic-data">Genomic Data</option>
            <option value="health-record">Health Record</option>
            <option value="medical-image">Medical Image</option>
          </select>
        </label><p/>
        <label>
          <span>組織&nbsp;</span>{/*需要改成可以從ckan端取得資料*/}
          <select id="ownerOrg" name="ownerOrg" value={ownerOrg} onChange={ownerOrgChange}>
            <option value=""></option>
            <option value="academia-sinica">Academia Sinica</option>
            <option value="national-taipei-university-of-nursing-and-health-sciences">National Taipei University of Nursing and Health Sciences</option>
            <option value="national-yang-ming-chiao-tung-university">National Yang-Ming Chiao Tung University</option>
            <option value="taipei-veterans-general-hospital">Taipei Veterans General Hospital</option>
          </select>
        </label>
        {/* 操作按鈕 */}
        <div>
          <button type="submit" className="add">
              Submit
            </button>
            <button type="reset" onClick={btn_reset} className="add">
              Reset
            </button>
            <button className="add" onClick={btn_cancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
