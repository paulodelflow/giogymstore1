import React from 'react';

export const ResponsiveTable = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto w-full">
      {/* Tabla para pantallas grandes */}
      <table className="min-w-full table-auto hidden md:table">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-xs leading-normal">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-6">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-100">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-3 px-6">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="md:hidden space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-white shadow-md rounded-lg p-4">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex justify-between py-2">
                <span className="font-medium text-gray-600">{headers[cellIndex]}</span>
                <span className="text-gray-800">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
