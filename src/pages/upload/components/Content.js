import React from 'react';
import './Content.css';

function Content(input_file) {
  var show_table = "";
  var time = Date();
  time = time.split(' ');
  time = time[3]+'-'+time[1]+'-'+time[2]+' '+time[4];
  const show = (input_file) => {
    for (let i = 0; i < input_file.length; i++) {
      const element = input_file[i];
      show_table +=
        `
        <tr>
          <td>${ i+1 }</td>
          <td>${element.name}</td>
          <td>READY</td>
          <td>Creat Time:${time}</td>
          <td>${element.size}</td>
          <td>Operation</td>
        </tr>
        `;
    }
    console.log(show_table);
  };
  show(input_file);
  return ( 
    <table>
      <thead>
        <tr>
          <th>NO.</th>
          <th>FileName</th>
          <th>Status</th>
          <th>Processing Progress</th>
          <th>FileSize</th>
          <th>Operation</th>
        </tr>        
      </thead>
      <tbody>
        {show_table}
      </tbody>
    </table>
  );
}

export default Content;