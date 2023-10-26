import "./index.css";
export default function VisualTable({ field, data, operate }) {
  return (
    field !== undefined &&
    data !== undefined && (
      <>
        <table className="visualTable">
          <thead>
            <tr>
              {field.map((element) => {
                return <th key={`th_${element.id}`}>{element.display}</th>;
              })}
              {operate !== undefined && <th>Operate</th>}
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
                  {operate !== undefined && (
                    <td>
                      <button
                        onClick={() => {
                          console.log("operate", operate);
                          console.log("ele", element.operate);
                          operate(element.operate);
                        }}
                      >
                        Operate
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    )
  );
}
