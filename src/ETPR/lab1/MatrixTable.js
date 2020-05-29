import React from 'react';

function MatrixTable({matrix}) {
  return (
    <table>
      <tbody>
      {matrix.map((row, i) => (
        <tr key={i}>
          {row.map((col, j) => (
            <td key={j} className="border-solid border-2 border-gray-600">{col}</td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
}

export default MatrixTable;
