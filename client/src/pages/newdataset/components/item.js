import "../index.css";
import ClearIcon from "@mui/icons-material/Clear";

const Item = ({ id, symptoms, description, listDelete, submittingState1 }) => {
  function deleteItem() {
    submittingState1.current = true;
    listDelete(function (prev) {
      return prev.filter((item) => item.id !== id);
    });
  }
  return (
    <div>
      <div className="div_index">
        &nbsp;{symptoms}&nbsp;
        <button onClick={deleteItem} className="button_cancel">
          <ClearIcon />
        </button>
      </div>
    </div>
  );
};

export default Item;
