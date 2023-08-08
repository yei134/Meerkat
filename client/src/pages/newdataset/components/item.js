import "../index.css";

const Item = ({ id, symptoms, description, listDelete, submittingState1 }) => {
  function deleteItem() {
    submittingState1.current = true;
    listDelete(function (prev) {
      return prev.filter((item) => item.id !== id);
    });
  }
  console.log(description);
  return (
    <div>
      <div className="div_index">
        &nbsp;{symptoms}&nbsp;/&nbsp;{description}&nbsp;
        <button onClick={deleteItem} className="button_cancel"></button>
      </div>
    </div>
  );
};

export default Item;