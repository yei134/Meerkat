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
          <div>*名稱：</div>
          <input type="text" value={name} onChange={nameChange} className="textbox" />
        </label>
        <p/>
        <label>
          <div>*標題：</div>
          <input type="text" value={title} onChange={titleChange} className="textbox"/>
          <span>(需英文且不可有空白)</span>
        </label>
        <hr></hr>
        <label>
          <div>說明：</div>
          <textarea value={note} onChange={noteChange} />
        </label>
        <label>
          <div>
            <span><input type="checkbox" value={private_dataset} onChange={setPrivate}/></span>
            公開
          </div>
        </label><p/>
        <label>{/*需要改成可以從ckan端取得資料*/}
          <span>所屬群組&nbsp;</span>
          <select id="groups" name="groups">
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
          <select id="ownerOrg" name="ownerOrg" >
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
