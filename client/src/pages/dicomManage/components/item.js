import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Checkbox } from '@mui/material';

const Item =({
  symptomId,
  number,
  AccessionNumber,
  PatientID,
  dicomUID,
  SOPInstanceUID,
  StudyInstanceUID,
  Modality,
  StudyDescription,
  SeriesInstanceUID,
  type,
  ValueAdd,
  ValueDelete
}) => {
  var [ deleteObject, setDeleteObject ] = useState({});
  var [ dicomUIDs, setDicomUIDs ] = useState("");
  function CheckboxChange(e) {
    setDicomUIDs("");
    dicomUIDs=e.target.value;
    setDicomUIDs(dicomUIDs);
    if(e.target.checked===true){
      ValueAdd(dicomUIDs);  //呼叫父層級(ConRight)改值
      return dicomUIDs;
    }
    else{
      ValueDelete(dicomUIDs); //呼叫父層級(ConRight)改值
      return dicomUIDs;
      }
    }

  return (
    <tr>
      <td>{number}</td>
      <td>{StudyInstanceUID}</td>
      <td>{SeriesInstanceUID}</td>
      <td>{SOPInstanceUID}</td>
      <td>{AccessionNumber}</td>
      <td>{PatientID}</td>
      <td>{Modality}</td>
      <td>{StudyDescription}</td>
      <td>{type}</td>
      <td>
        <div className='actionbutton-container'>
          <button onClick={CheckboxChange} className="btnView" title={`檢視 ${StudyInstanceUID}`}>
            <a href={`https://raccoon.dicom.org.tw/html/BL/bluelight/html/start.html?StudyInstanceUID=${StudyInstanceUID}`} target="_blank">
              <VisibilityIcon/>
            </a>
          </button>
          <Checkbox onChange={CheckboxChange} value={StudyInstanceUID}></Checkbox>
        </div>
      </td>
    </tr>
  )
}

export default Item;