//套件
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActionButton = ({ title, id, author, author_email, maintainer, maintainer_email, notes, datasetName }) => {
  const [res, setRes] = useState();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    console.log(maintainer_email);
    if (title == "") {
      alert("Title未填寫！");
    } else {
      alert("修改中...");
      try {
        await axios
          .patch(
            `${process.env.REACT_APP_BACKEND_URI}api/ckan/package_patch`,
            {
              id: id,
              title: title,
              author: author,
              author_email: author_email,
              maintainer: maintainer,
              maintainer_email: maintainer_email,
              notes: notes,
            },
            {
              headers: { Authorization: process.env.REACT_APP_CKAN_TOKEN },
            }
          )
          .then((res) => {
            const response = res.data.status;
            setRes(response);
            handleAlert();
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("修改失敗！");
      }
    }
  };
  const handleAlert = () => {
    if (res.private.success == 200 && res.public.success == 200) {
      alert("修改成功！");
      navigate(`/datasetInfo/${id}`);
    }
  };
  function DeleteDataset() {
    const data = { id: datasetName, use_in_private: "false" };
    const FormData = JSON.stringify(data);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_purge`, {
        data: FormData,
        headers: {
          Authorization: process.env.REACT_APP_CKAN_TOKEN,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if ((res.status = 200)) {
          alert(datasetName + "已被刪除！");
          navigate("/");
        } else {
          alert("刪除失敗！");
        }
      })
      .catch((error) => console.error(error));
  }
  return (
    <div>
      <button onClick={handleSubmit} className="edit-save-button">
        Save
      </button>
      <button className="edit-cancel-button">
        <a href={`/datasetInfo/${datasetName}`}>Cancel</a>
      </button>
      <button onClick={DeleteDataset} className="delete-dataset-button">
        Delete dataset
      </button>
    </div>
  );
};
export default ActionButton;
