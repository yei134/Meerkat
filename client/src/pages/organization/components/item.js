const Item=({title, notes, name})=>{
return(
  <div className="package_list">
    <a href={`/datasetInfo/${name}`} className="package_list_title">{title}</a>
    <font className="package_list_notes">{notes}</font>
  </div>
  
)
}
export default Item;