
// const Item = ({
//   id,
//   number,
//   fileName,
//   processingProgress,
//   fileSize,
//   setUploadFile,
//   isChecked,
//   // downloadUrl,

// }) => {
//   //暫改(後續接上後端，下載會抓檔案的URL)
//   // const handleDownload = async () => {
//   //   try {
//   //     const response = await fetch(downloadUrl);
//   //     const blob = await response.blob();
//   //     const url = window.URL.createObjectURL(new Blob([blob]));
//   //     const link = document.createElement("a");
//   //     link.href = url;
//   //     link.setAttribute("download", fileName);
//   //     document.body.appendChild(link);
//   //     link.click();
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   return (
//     <tr>
//       <td>{number}</td>
//       <td>{fileName}</td>
//       <td>Created&ensp;Time:{processingProgress}</td>
//       <td>{fileSize}</td>
//       <td>
//         {/* 勾選刪除 
//         當使用者勾選或取消勾選時，會執行 onChange 函式
//         checked 屬性是用來控制 input 元素的勾選狀態
//         透過 isChecked 狀態值控制
//         prev.map->將目前的 prev 狀態值中的每個元素進行遍歷，並對每個元素執行一個判斷
//         */}
//           {/* <button onClick={handleDownload}>下載</button> */}
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={() => setUploadFile((prev) => {
//             return prev.map((item) => {
//               if (item.id === id) {
//                 return { ...item, isChecked: !isChecked };
//               }
//               return item;
//             });
//           })}
//         />
//         </td>
//     </tr>
//   );
// };
// export default Item;
