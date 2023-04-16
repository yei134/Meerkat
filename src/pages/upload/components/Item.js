const Item = ({
  id,
  number,
  fileName,
  fileStatus,
  processingProgress,
  fileSize,
  setUploadFile,
}) => {
  function deleteItem() {
    setUploadFile(function (prev) {
      return prev.filter((item) => item.id !== id);
    });
  }
  return (
    <tr className="item">
      <td>{number}</td>
      <td>{fileName}</td>
      <td>{fileStatus}</td>
      <td>Created&ensp;Time:{processingProgress}</td>
      <td>{fileSize}</td>
      <td>
        {/* 代改 */}
        <button>1</button>
        <button>2</button>
        <button onClick={deleteItem} className="remove">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Item;
