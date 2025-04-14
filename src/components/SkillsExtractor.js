import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import SkillsExtractionTool from './SkillsExtractionTool';
import StatementsTable from './StatementsTable';
import StatementDetails from './StatementDetails';

// Sample data for demo purposes
const SAMPLE_TAXONOMY = [
  { Skill_name: "Software Development" },
  { Skill_name: "Project Management" },
  { Skill_name: "Data Analysis" },
  { Skill_name: "Machine Learning" },
  { Skill_name: "Quality Assurance" },
  { Skill_name: "DevOps" },
  { Skill_name: "UX Design" },
  { Skill_name: "Network Security" },
  { Skill_name: "Cloud Computing" },
  { Skill_name: "Database Administration" },
  { Skill_name: "Agile Methodologies" },
  { Skill_name: "Requirements Analysis" },
  { Skill_name: "Test Automation" },
  { Skill_name: "System Architecture" },
  { Skill_name: "Technical Documentation" }
];

const SAMPLE_STATEMENTS = [
  { ID: "1", statement: "Develop software applications using modern programming languages and frameworks.", Type: "Knowledge" },
  { ID: "2", statement: "Apply software testing methodologies to ensure quality and identify defects.", Type: "Knowledge" },
  { ID: "3", statement: "Design user interfaces that enhance user experience and accessibility.", Type: "Skill" },
  { ID: "4", statement: "Implement secure coding practices to prevent security vulnerabilities and protect sensitive data.", Type: "Skill" },
  { ID: "5", statement: "Manage database systems including design, implementation and optimization for performance.", Type: "Knowledge" },
  { ID: "6", statement: "Work with stakeholders to gather and analyze business requirements.", Type: "Behavior" },
  { ID: "7", statement: "Deploy and configure cloud infrastructure for scalable application hosting.", Type: "Skill" },
  { ID: "8", statement: "Create technical documentation for system components and architectures.", Type: "Knowledge" }
];

const SkillsExtractor = () => {
  const [extractor, setExtractor] = useState(null);
  const [taxonomyFile, setTaxonomyFile] = useState(null);
  const [statementsFile, setStatementsFile] = useState(null);
  const [taxonomyData, setTaxonomyData] = useState([]);
  const [statementsData, setStatementsData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('statements');
  const [sortField, setSortField] = useState('qualityScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [useSampleData, setUseSampleData] = useState(false);

  // Initialize the extractor
  useEffect(() => {
    setExtractor(new SkillsExtractionTool());
  }, []);

  // Function to handle taxonomy file upload
  const handleTaxonomyUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setTaxonomyFile(file);
    setIsProcessing(true);
    
    try {
      // Parse the CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setTaxonomyData(results.data);
          } else {
            console.error("No data found in taxonomy file");
          }
          setIsProcessing(false);
        },
        error: (error) => {
          console.error("Error parsing taxonomy file:", error);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error("Error processing taxonomy file:", error);
      setIsProcessing(false);
    }
  };

  // Function to handle statements file upload
  const handleStatementsUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setStatementsFile(file);
    setIsProcessing(true);
    
    try {
      // Parse the CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setStatementsData(results.data);
          } else {
            console.error("No data found in statements file");
          }
          setIsProcessing(false);
        },
        error: (error) => {
          console.error("Error parsing statements file:", error);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error("Error processing statements file:", error);
      setIsProcessing(false);
    }
  };

  // Function to load sample data
  const loadSampleData = () => {
    setTaxonomyData(SAMPLE_TAXONOMY);
    setStatementsData(SAMPLE_STATEMENTS);
    setUseSampleData(true);
  };

  // Function to run the analysis
  const runAnalysis = () => {
    if (!extractor || taxonomyData.length === 0 || statementsData.length === 0) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the skills taxonomy
      extractor.processSkillTaxonomy(taxonomyData);
      
      // Process the statements
      const results = extractor.processStatements(statementsData);
      setAnalysisResults(results);
      
      // Set the first statement as selected for detailed view
      if (results.results && results.results.length > 0) {
        setSelectedStatement(results.results[0]);
      }
    } catch (error) {
      console.error("Error running analysis:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to view statement details
  const viewStatementDetails = (statement) => {
    setSelectedStatement(statement);
    setActiveTab('details');
  };

  // Export results to CSV
  const exportToCSV = () => {
    if (!analysisResults) return;

    const csvData = Papa.unparse(analysisResults.results.map(result => ({
      ID: result.id,
      Type: result.type || '',
      Statement: result.statement,
      WordCount: result.wordCount,
      SkillCount: result.skillCount,
      UniqueSkillCount: result.uniqueSkillCount,
      SkillDensity: result.skillDensity,
      SimpleSkills: result.simpleSkills,
      ComplexSkills: result.complexSkills,
      QualityScore: result.qualityScore,
      Skills: result.matchedSkills.map(s => s.skill).join(', ')
    })));

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'skills_analysis_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export results to JSON - new function for JSON export
  const exportToJSON = () => {
    if (!analysisResults) return;

    // Create a complete JSON object with all analysis data
    const jsonData = JSON.stringify({
      summary: analysisResults.summary,
      statements: analysisResults.results
    }, null, 2); // Pretty print with 2-space indentation

    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'skills_analysis_results.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Skills Extraction Analysis</h2>
      
      {/* Sample Data Option */}
      {!analysisResults && !useSampleData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="mb-2">Don't have your own data files? Try our sample data:</p>
          <button
            onClick={loadSampleData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Sample Data
          </button>
        </div>
      )}
      
      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Step 1: Upload Skills Taxonomy</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleTaxonomyUpload}
            className="block w-full text-sm text-gray-500 mb-2"
          />
          {taxonomyData.length > 0 && (
            <p className="text-sm text-gray-600">
              {useSampleData ? 'Sample Data' : taxonomyFile?.name}
              <span className="ml-2 text-green-500">
                ✓ {taxonomyData.length} skills loaded
              </span>
            </p>
          )}
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Step 2: Upload Statements</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleStatementsUpload}
            className="block w-full text-sm text-gray-500 mb-2"
          />
          {statementsData.length > 0 && (
            <p className="text-sm text-gray-600">
              {useSampleData ? 'Sample Data' : statementsFile?.name}
              <span className="ml-2 text-green-500">
                ✓ {statementsData.length} statements loaded
              </span>
            </p>
          )}
        </div>
      </div>
      
      {/* Analysis Button */}
      <div className="mb-6">
        <button
          onClick={runAnalysis}
          disabled={!taxonomyData.length || !statementsData.length || isProcessing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mr-2"
        >
          {isProcessing ? 'Processing...' : 'Run Skills Analysis'}
        </button>
        
        {analysisResults && (
          <div className="inline-block">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
            >
              Export to CSV
            </button>
            <button
              onClick={exportToJSON}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Export to JSON
            </button>
          </div>
        )}
      </div>
      
      {/* Results Section */}
      {analysisResults && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded border text-center">
              <p className="text-sm text-gray-600">Total Statements</p>
              <p className="text-2xl font-bold">{analysisResults.summary.totalStatements}</p>
            </div>
            <div className="p-4 bg-green-50 rounded border text-center">
              <p className="text-sm text-gray-600">With Skills</p>
              <p className="text-2xl font-bold">{analysisResults.summary.statementsWithSkills}</p>
              <p className="text-xs text-gray-500">
                ({analysisResults.summary.percentWithSkills}%)
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded border text-center">
              <p className="text-sm text-gray-600">Avg Skills/Statement</p>
              <p className="text-2xl font-bold">{analysisResults.summary.avgSkillsPerStatement}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded border text-center">
              <p className="text-sm text-gray-600">Avg Quality Score</p>
              <p className="text-2xl font-bold">{analysisResults.summary.avgQualityScore}</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-4 border-b">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('statements')}
                  className={`inline-block p-4 ${
                    activeTab === 'statements'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Statements Analysis
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`inline-block p-4 ${
                    activeTab === 'details'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={!selectedStatement}
                >
                  Statement Details
                </button>
              </li>
            </ul>
          </div>
          
          {/* Statement Analysis Tab */}
          {activeTab === 'statements' && (
            <StatementsTable 
              results={analysisResults.results}
              onViewDetails={viewStatementDetails}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={(field) => {
                if (sortField === field) {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField(field);
                  setSortDirection('desc');
                }
              }}
            />
          )}
          
          {/* Statement Details Tab */}
          {activeTab === 'details' && selectedStatement && (
            <StatementDetails 
              statement={selectedStatement}
              extractor={extractor}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsExtractor;
