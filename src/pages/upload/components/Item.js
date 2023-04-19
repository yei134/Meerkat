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
  function uploadItem() {
    setUploadFile(function (prev) {
      const newUploadFile = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            fileStatus: "SUCCESS",
          };
        }
        return item;
      });
      return newUploadFile;
    });
  }
  return (
    <tr>
      <td>{number}</td>
      <td>{fileName}</td>
      <td>{fileStatus}</td>
      <td>Created&ensp;Time:{processingProgress}</td>
      <td>{fileSize}</td>
      <td>
        {/* 代改 */}
        <button onClick={uploadItem} className="btnUpload">upload</button>
        <button onClick={deleteItem} className="remove">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Item;
