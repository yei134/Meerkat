import Item from "./item";

const List = ({ listMatter, listDelete, submittingState }) => {
  return (
    <div className="list">
      {listMatter.map((item) => {
        const { id, matter, date, time } = item;
        return (
          <Item
            key={id}
            id={id}
            note={matter}
            date={date}
            time={time}
            listDelete={listDelete}
            submittingState={submittingState}
          />
        );
      })}
    </div>
  );
};

export default List;
