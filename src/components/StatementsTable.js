import React from 'react';
import _ from 'lodash';

const StatementsTable = ({ results, onViewDetails, sortField, sortDirection, onSort }) => {
  // Get sorted results
  const getSortedResults = () => {
    return _.orderBy(
      results,
      [result => {
        // Handle numeric fields
        if (sortField === 'skillCount' || sortField === 'wordCount') {
          return result[sortField];
        }
        // Handle quality score
        if (sortField === 'qualityScore') {
          return parseFloat(result[sortField]);
        }
        // Handle string fields
        return result[sortField] || '';
      }],
      [sortDirection]
    );
  };
  
  const getQualityClass = (score) => {
    const numScore = parseFloat(score);
    if (numScore <= 0.25) return 'bg-red-500';
    if (numScore <= 0.50) return 'bg-orange-500';
    if (numScore <= 0.75) return 'bg-yellow-500';
    if (numScore <= 1.25) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">ID</th>
            <th className="p-2 border text-left">Type</th>
            <th 
              className="p-2 border text-left cursor-pointer hover:bg-gray-200"
              onClick={() => onSort('statement')}
            >
              Statement {sortField === 'statement' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-2 border text-center cursor-pointer hover:bg-gray-200"
              onClick={() => onSort('wordCount')}
            >
              Words {sortField === 'wordCount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-2 border text-center cursor-pointer hover:bg-gray-200"
              onClick={() => onSort('skillCount')}
            >
              Skills {sortField === 'skillCount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-2 border text-center cursor-pointer hover:bg-gray-200"
              onClick={() => onSort('qualityScore')}
            >
              Quality {sortField === 'qualityScore' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getSortedResults().map((result) => (
            <tr key={result.id} className="hover:bg-gray-50">
              <td className="p-2 border">{result.id}</td>
              <td className="p-2 border">{result.type || '-'}</td>
              <td className="p-2 border">
                {result.statement.length > 60
                  ? `${result.statement.substring(0, 60)}...`
                  : result.statement}
              </td>
              <td className="p-2 border text-center">{result.wordCount}</td>
              <td className="p-2 border text-center">{result.skillCount}</td>
              <td className="p-2 border text-center">
                <span 
                  className={`px-2 py-1 rounded text-white ${getQualityClass(result.qualityScore)}`}
                >
                  {result.qualityScore}
                </span>
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => onViewDetails(result)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatementsTable;
