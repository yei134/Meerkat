import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from "uuid";

const Edit = ({ add, symptomsAdd, submittingState, submittingState1, dataset, arraySymptoms}) => {
  //新增資料集畫面需要的參數
  const [name, setName] = useState("");//package_create name (資料集英文名稱 用來當檔案名的 不可有空白 數字開頭
  const [title, setTitle] = useState("")//package_create title(資料集的名字 可以中文
  const [note, setNote] = useState("");//package_create note(說明
  const [private_dataset, setPrivate] = useState(false);//package_create private(是否對外公開 如果不要對外公開要有組織
  const [groups, setGroups] = useState("");//package_create groups(屬於哪一類群組 如腦部 肺部
  const [ownerOrg, setOwnerOrg] = useState("");//package_create owner_org(組織id 例如25188a0c-7f13-4562-a5e2-042df726de3c
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [symptoms, setSymptoms] = useState([]);//病徵
  const navigate = useNavigate();

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
  function symptomsChange(e) {//索引檔名稱輸入時判斷
    //條件：只能輸入 "小寫英文字母" 和 "_"
    const value = e.target.value;
    if(/^[a-z_]*$/.test(value)){
      setInput1(value);
    }
    else{
      alert("請輸入小寫英文字母！");
    }
  }
  function descriptionChange(e){
    setInput2(e.target.value);
  }

  //按鈕活動方法
  function addSymptoms() {  
    var flag = 0;
    //條件1：接到的值不能為空字串
    //條件2：接到的值不能重複使用
    arraySymptoms.map(
      (item)=>{
        const {symptoms} = item;
        if (symptoms === input1) {
          alert("此名稱已輸入過，請換其他名稱！");
          flag=1;
          return;
        }
      }
    )
    if(flag === 0){
    submittingState1.current = true;
      //addItem(symptoms);
      if(input1==="" || input2===""){
        alert("請輸入名稱再做新增！");
      }
      else{
        symptomsAdd(function (prev) {
          return [
            ...prev,
            {
              id: v4(),
              symptoms: input1,
              description: input2
            },
          ];
        });
      }
    }
  }

  function btn_submit(){
    submittingState.current = true;
    //設一個字串檢查特定欄位有沒有填寫，若沒填寫要發出警告
    if(name===""){
      alert("名字尚未填寫！");
      return;
    }
    else if(title===""){
      alert("標題尚未填寫！")
      return;
    }
    else{
      add(function () {
        return [
          {
            name,
            title,
            note,
            private_dataset,
            groups,
            ownerOrg,
          },
        ];
      });
      alert("資料集創建成功！");
      //存至Ckan後頁面重整，表單清空
      setName("")
      setTitle("")
      setNote("")
      setPrivate(false)
      setGroups("")
      setOwnerOrg("")
      navigate('/fileUpload');
    }
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
    // btn_submit();
    navigate('/');
  }

  return (
    <div>
      <div className="newDatasetDiv">
        <h1>資料集新增</h1>
        <form>
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
          <hr></hr>
          {/* 操作按鈕 */}
          <label>
            <div className='div'>
              <h5>*索引檔名稱：</h5>
              <input 
              type="text" 
              value={input1} 
              onChange={symptomsChange} 
              placeholder="請以英文病徵命名(需小寫英文字母，可附加 ' _ ' 符號)"
              className="textbox nameBox"/>
              <h5>*索引檔名稱：</h5>
              <input
              type="text" 
              value={input2}
              onChange={descriptionChange}
              placeholder="請以中文病徵命名"
              className="textbox nameBox"/>
            </div>
          </label>
          <div>      
        </div>
      </form>
    </div>    
    <button onClick={addSymptoms} className="add">
      新增
    </button> 
    <button className="add" onClick={btn_submit}>
      Submit
    </button>
    <button className="add" onClick={btn_reset}>
      Reset
    </button>
    <button className="add" onClick={btn_cancel}>
      Cancel
    </button>
  </div>
  );
};

export default Edit;


