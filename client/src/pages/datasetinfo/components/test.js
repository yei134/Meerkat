import React, { useState } from 'react';

function InputList() {
  const [inputs, setInputs] = useState([]);

  const addInput = () => {
    const newInputs = [...inputs];
    newInputs.push(<input key={newInputs.length} />);
    setInputs(newInputs);
  };

  return (
    <div>
      <button onClick={addInput}>Add Input</button>
      {inputs.map((input) => input)}
    </div>
  );
}

export default InputList;