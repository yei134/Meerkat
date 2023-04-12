import { useState } from "react";
import { v4 } from "uuid";

const Edit = ({ add, submittingState }) => {
  //變數與畫面物件綁定
  const [matter, setMatter] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(" ");

  function matterChange(e) {
    setMatter(e.target.value);
  }
  function dateChange(e) {
    setDate(e.target.value);
  }
  function timeChange(e) {
    setTime(e.target.value);
  }

  function addMatter() { 
    submittingState.current = true;  
    add(function (prev) {
      return [
        ...prev,
        {
          id: v4(),
          matter,
          date,
          time,
        },
      ];
    });
  }

  return (
    <div>
      <h1>備忘錄</h1>
      <p>記事：</p>
      <input type="text" value={matter} onChange={matterChange} />
      <p>日期：</p>
      <input type="date" value={date} onChange={dateChange} />
      <p>時間：</p>
      <input type="time" value={time} onChange={timeChange} />
      <button onClick={addMatter} className="add">
        新增
      </button>
    </div>
  );
};

export default Edit;
