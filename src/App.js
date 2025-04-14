import React from 'react';
import SkillsExtractor from './components/SkillsExtractor';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Educational Skills Extraction Tool</h1>
          <p className="text-sm">Automatically identify and extract skills from educational program statements</p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto mt-8 pb-16 px-4">
        <SkillsExtractor />
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <p className="mb-4">
            The Educational Skills Extraction Tool automatically identifies skills mentioned in educational program statements, 
            course descriptions, or learning outcomes. It uses natural language processing techniques to match skills from a 
            comprehensive taxonomy to the text.
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">How It Works</h3>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Upload a CSV file containing your skills taxonomy (or use our sample data)</li>
            <li>Upload a CSV file with educational statements to analyze</li>
            <li>Click "Run Skills Analysis" to process the data</li>
            <li>View the results showing which skills were found in each statement</li>
            <li>Export the analysis to CSV or JSON for further processing</li>
          </ol>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Quality Scoring</h3>
          <p className="mb-2">Statements are evaluated based on several factors:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Skill Density</strong> - How many skills are mentioned relative to statement length</li>
            <li><strong>Complexity Ratio</strong> - The proportion of multi-word (more specific) skills</li>
            <li><strong>Specificity</strong> - How specialized the identified skills are</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-4">
            <div className="p-2 bg-red-100 rounded text-center">
              <span className="inline-block px-2 py-1 bg-red-500 text-white rounded text-sm mb-1">0.00-0.25</span>
              <p className="text-xs">Poor quality</p>
            </div>
            <div className="p-2 bg-orange-100 rounded text-center">
              <span className="inline-block px-2 py-1 bg-orange-500 text-white rounded text-sm mb-1">0.26-0.50</span>
              <p className="text-xs">Basic quality</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded text-center">
              <span className="inline-block px-2 py-1 bg-yellow-500 text-white rounded text-sm mb-1">0.51-0.75</span>
              <p className="text-xs">Good quality</p>
            </div>
            <div className="p-2 bg-green-100 rounded text-center">
              <span className="inline-block px-2 py-1 bg-green-500 text-white rounded text-sm mb-1">0.76-1.25</span>
              <p className="text-xs">Very good quality</p>
            </div>
            <div className="p-2 bg-blue-100 rounded text-center">
              <span className="inline-block px-2 py-1 bg-blue-500 text-white rounded text-sm mb-1">1.26+</span>
              <p className="text-xs">Excellent quality</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">CSV Format Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-1">Skills Taxonomy CSV</h4>
              <p className="text-sm mb-2">Your skills CSV should include:</p>
              <ul className="list-disc ml-6 text-sm">
                <li>A header row with column names</li>
                <li>A column named "Skill_name" containing the skill names</li>
                <li>One skill per row</li>
              </ul>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                Skill_name,Category,Domain<br />
                Software Development,Technical,IT<br />
                Project Management,Management,Business
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Statements CSV</h4>
              <p className="text-sm mb-2">Your statements CSV should include:</p>
              <ul className="list-disc ml-6 text-sm">
                <li>A header row with column names</li>
                <li>A column named "statement" containing the text to analyze</li>
                <li>An "ID" column for statement identification</li>
                <li>Optionally, a "Type" column to categorize statements</li>
              </ul>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                ID,statement,Type<br />
                001,"Design user interfaces",Skill<br />
                002,"Implement secure coding",Knowledge
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Educational Skills Extraction Tool © 2025</p>
            <p className="mt-1">
              <a 
                href="https://github.com/your-repo/skills-extraction-tool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub Repository
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
