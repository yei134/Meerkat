import "./index.css";
export default function VisualTable({ field, data }) {
  return (
    field !== undefined &&
    data != undefined && (
      <>
        <table className="visualTable">
          <thead>
            <tr>
              {field.map((element) => {
                return <th key={`th_${element.id}`}>{element.display}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((element, index) => {
              element.index = index;
              return (
                <tr key={`tb_${element.index}`}>
                  {field.map((fieldElement) => {
                    return <td key={`td_${element.index}-${fieldElement.id}`}>{element[fieldElement.name]}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    )
  );
}
