import React from 'react';

const StatementDetails = ({ statement, extractor }) => {
  // Function to render a statement with highlighted skills
  const renderHighlightedStatement = () => {
    if (!statement || !statement.statement) return null;
    
    // Generate highlighted HTML
    const highlightedHTML = extractor.generateHighlightedHTML(statement);
    
    // Return a component that renders the HTML safely
    return (
      <div 
        className="p-4 bg-gray-50 rounded border"
        dangerouslySetInnerHTML={{ __html: highlightedHTML }}
      />
    );
  };
  
  const getQualityClass = (score) => {
    const numScore = parseFloat(score);
    if (numScore <= 0.25) return 'bg-red-100 border-red-300';
    if (numScore <= 0.50) return 'bg-orange-100 border-orange-300';
    if (numScore <= 0.75) return 'bg-yellow-100 border-yellow-300';
    if (numScore <= 1.25) return 'bg-green-100 border-green-300';
    return 'bg-blue-100 border-blue-300';
  };
  
  return (
    <div className="bg-white p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Statement Details</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-2 bg-gray-50 rounded border">
          <p className="text-xs text-gray-500">ID</p>
          <p className="font-medium">{statement.id}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded border">
          <p className="text-xs text-gray-500">Type</p>
          <p className="font-medium">{statement.type || '-'}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded border">
          <p className="text-xs text-gray-500">Words</p>
          <p className="font-medium">{statement.wordCount}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded border">
          <p className="text-xs text-gray-500">Quality Score</p>
          <p className="font-medium">{statement.qualityScore}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Statement with Highlighted Skills</h4>
        {renderHighlightedStatement()}
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Matched Skills ({statement.skillCount})</h4>
        {statement.matchedSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {statement.matchedSkills.map((skill, index) => (
              <div 
                key={index} 
                className={`p-2 rounded border ${
                  skill.type === 'multi' ? 'bg-blue-50' : 'bg-yellow-50'
                }`}
              >
                <p className="font-medium">{skill.skill}</p>
                <p className="text-xs text-gray-600">
                  Type: {skill.type === 'multi' ? 'Multi-word' : 'Single-word'} | 
                  Words: {skill.words}
                  {skill.specificity && ` | Specificity: ${skill.specificity.toFixed(4)}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills matched in this statement.</p>
        )}
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Quality Assessment</h4>
        <div className={`p-3 rounded border ${getQualityClass(statement.qualityScore)}`}>
          <p className="font-medium">
            {extractor.getQualityRating(statement.qualityScore)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {parseFloat(statement.qualityScore) <= 0.25 ? 
              'This statement contains few skills and is mostly generic.' :
            parseFloat(statement.qualityScore) <= 0.50 ?
              'This statement contains some skills with a mix of generic and specific terms.' :
            parseFloat(statement.qualityScore) <= 0.75 ?
              'This statement has good skills coverage with more specific terminology.' :
            parseFloat(statement.qualityScore) <= 1.25 ?
              'This statement has high skills coverage with mostly specific terminology.' :
              'This statement has exceptional skills coverage and specificity.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatementDetails;
