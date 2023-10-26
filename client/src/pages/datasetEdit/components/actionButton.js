import React, {useEffect, useState} from "react";
import axios from "axios";

const ActionButton = ({title, id, author, author_email, maintainer, maintainer_email, notes, datasetName}) => {
  var [ res, setRes ] = useState();
  const handleSubmit= async () =>{
    console.log(maintainer_email);
    if(title==""){
      alert('Title未填寫！');
    }else{
      alert('修改中...');
      try {
        await axios.patch( 
          `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_patch`,
            {
              id:id,
              title:title,
              author:author,
              author_email:author_email,
              maintainer:maintainer,
              maintainer_email:maintainer_email,
              notes:notes
            },{
              headers:{'Authorization':  process.env.REACT_APP_CKAN_TOKEN}
            }
        )
        .then(response => {
          console.log(response.data.status);
          res=response.data.status;
          setRes(res);
          handleAlert();
        })
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('修改失敗！');
      }
    }
  }
  const handleAlert=()=>{
    if(res.private.success==200 && res.public.success==200){
      alert('修改成功！');
    }
  }
  return(
    <div>
      <button onClick={handleSubmit} className="edit-save-button">Save</button>
      <button className="edit-cancel-button"><a href={`/datasetInfo/${datasetName}`}>Cancel</a></button>
    </div>
  )
}
export default ActionButton;