import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from "uuid";
import axios from 'axios';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

/*諄  變數需重新設定*/

const Edit = ({ add, symptomsAdd, submittingState1, dataset, arraySymptoms}) => {

  //新增資料集畫面需要的參數
  const [name, setName] = useState("");//package_create name (資料集英文名稱 用來當檔案名的 不可有空白 數字開頭
  const [title, setTitle] = useState("")//package_create title(資料集的名字 可以中文
  const [note, setNote] = useState("");//package_create note(說明
  const [private_dataset, setPrivate] = useState(false);//package_create private(是否對外公開 如果不要對外公開要有組織
  const [author, setAuthor] = useState("");
  const [author_email, setAuthor_email] = useState("");
  const [maintainer, setMaintainer] = useState("");
  const [maintainer_email, setMaintainer_email] = useState("");
  const [groups, setGroups] = useState("");//package_create groups(屬於哪幾類群組 如腦部 肺部
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
  function authorChange(e){
    setAuthor(e.target.value);
  }
  function author_emailChange(e){
    setAuthor_email(e.target.value);
  }
  function maintainerChange(e){
    setMaintainer(e.target.value);
  }
  function maintainer_emailChange(e){
    setMaintainer_email(e.target.value);
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
    submittingState1.current = true;
    // 設一個字串檢查特定欄位有沒有填寫，若沒填寫要發出警告
    if(name===""){
      alert("名字尚未填寫！");
      return;
    }
    else if(title===""){
      alert("標題尚未填寫！")
      return;
    }
    else if(maintainer===""){
      alert("管理者尚未填寫！")
      return;
    }
    else if(maintainer_email===""){
      alert("管理者電子郵件尚未填寫！")
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
      setAuthor("")
      setAuthor_email("")
      setMaintainer("")
      setMaintainer_email("")
      setNote("")
      setPrivate(false)
      setGroups("")
      setOwnerOrg("")
      navigate(`datasetInfo/${name}/fileUpload`);
    }
    // test area
    sendTable()
  }
  function sendTable() {
    axios.post( 
      `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_create`,
        {
          name:name,
          title:title,
          author:author,
          author_email:author_email,
          maintainer:maintainer,
          maintainer_email:maintainer_email,
          note:note,
          owner_org:ownerOrg,
          // groups:groups
        },
        {
          headers:{
            'authorization': process.env.REACT_APP_CKAN_TOKEN,
            'Content-Type':'application/json'
          }
        }
    )
    .then( (response) => console.log(response))
    .catch( (error) => console.log(error))
  }
  //test
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
      <div>
        <div>
          <span className="new-title-style"><LibraryAddIcon/>&nbsp;Create&nbsp;Dataset</span>
        </div>
        <form>
          {/* 填寫區域 */}
          <div>
            <span>Dataset&nbsp;Name：<font className="edit-must-fill">&#8251;必填</font></span>
            <input
              type="text"
              value={name}
              onChange={nameChange}
              placeholder="需英文且不可有空白"
              className="new-form-input-style"
            />
          </div>
          <div>
            <span>Dataset&nbsp;Title：<font className="edit-must-fill">&#8251;必填</font></span>
            <input
              type="text"
              value={title}
              onChange={titleChange}
              className="new-form-input-style"
            />
          </div>
          <hr></hr>
          <div>
            <span>Author：</span>
            <input
              type="text"
              value={author}
              onChange={authorChange}
              className="new-form-input-style"
            />
          </div>
          <div>
            <span>Author&nbsp;E-mail：</span>
            <input
              type="text"
              value={author_email}
              onChange={authorChange}
              className="new-form-input-style"
            />
          </div>
          <div>
            <span>Mantainer：</span>
            <input
              type="text"
              value={maintainer}
              onChange={maintainerChange}
              className="new-form-input-style"
            />
          </div>
          <div>
            <span>Mantainer&nbsp;E-mail：</span>
            <input
              type="text"
              value={maintainer}
              onChange={maintainerChange}
              className="new-form-input-style"
            />
          </div>
          <div>
            <span>Mantainer&nbsp;E-mail：</span>
            <input
              type="text"
              value={maintainer}
              onChange={maintainerChange}
              className="new-form-input-style"
            />
          </div>
          <div>
            <span>Organization：</span>
            <select id="ownerOrg" className="new-form-input-style" name="ownerOrg" value={ownerOrg} onChange={ownerOrgChange}>
              <option value=""></option>
              <option value="academia-sinica">Academia Sinica</option>
              <option className="label_flex" value="national-taipei-university-of-nursing-and-health-scienses">National Taipei University of Nursing and Health Sciences</option>
              <option value="national-yang-ming-chiao-tung-university">National Yang-Ming Chiao Tung University</option>
              <option value="taipei-veterans-general-hospital">Taipei Veterans General Hospital</option>
            </select>
          </div>
          <div>
            <span>Notes:</span>
            <textarea value={note} onChange={noteChange} className="new-form-input-style" />
          </div>
          <hr></hr>
          {/* 操作按鈕 */}
          <label>
            <div className='div_symptom_name'>
              <h5>*索引檔名稱：</h5>
              <input 
              type="text" 
              value={input1} 
              onChange={symptomsChange} 
              placeholder="請以英文病徵命名(需小寫英文字母，可附加 ' _ ' 符號)"
              className="input-field"/>
              <h5>*索引檔名稱：</h5>
              <input
              type="text" 
              value={input2}
              onChange={descriptionChange}
              placeholder="請以中文病徵命名"
              className="input-field"/>
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

