import Item from "./item";

const List = ({ listSymptoms, listDelete, submittingState1}) => {
  return (
    <div className="symptoms_flex">
      {listSymptoms.map((item) => {
        const { id, symptoms, description} = item;
        console.log(id);
        return (
          <Item
            key={id}
            id={id}
            symptoms={symptoms} 
            description={description}
            listDelete={listDelete}
            submittingState1={submittingState1}
          />
        );
      })}
    </div>
  );
};

export default List;