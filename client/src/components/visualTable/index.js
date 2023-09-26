import "./index.css";
export default function VisualTable({ field, data }) {
  return (
    field !== undefined &&
    data != undefined && (
      <>
        <table className="visualTable">
          <thead>
            <tr>
              {field.map((value) => {
                return <th key={`thead_${value}`}>{value}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((element, index) => {
              return (
                <tr key={`tbody_${index}`}>
                  {field.map((value) => {
                    return (
                      <td key={`tr_${value}${index}`}>{element[value]}</td>
                    );
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
