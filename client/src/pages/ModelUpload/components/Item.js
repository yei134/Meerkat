const Item = ({
  id,
  number,
  fileName,
  modelClass,
  versionNumber,
  processingProgress,
  fileSize,
  modelNote,
  modelPublic,
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
      <td>{modelClass}</td>
      <td>{versionNumber}</td>
      <td>Created&ensp;Time:{processingProgress}</td>
      <td>{fileSize}&nbsp;B</td>
      <td>{modelNote}</td>
      <td>
        {/* 代改 */}
        <button>{modelPublic}</button>
        <button>Edit</button>
        <button onClick={deleteItem} className="remove">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Item;
