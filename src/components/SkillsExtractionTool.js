/**
 * Educational Skills Extraction Tool
 * 
 * This tool automatically extracts skills from educational program text using a comprehensive
 * skill taxonomy. It implements advanced NLP-inspired techniques for accurate skill identification
 * and provides quality metrics to evaluate statement effectiveness.
 */
class SkillsExtractionTool {
  constructor() {
    // Common stopwords to exclude from matching
    this.stopwords = new Set([
      'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 
      'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 
      'but', 'by', 'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 
      'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 
      'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 
      'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 
      'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 
      'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 
      'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 
      'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 
      'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 
      'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 
      'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 
      'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 
      'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 
      'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 
      'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
    ]);
    
    // Comprehensive lemmatization rules
    this.lemRules = {
      // Verbs
      'developing': 'develop', 'develops': 'develop', 'developed': 'develop',
      'testing': 'test', 'tests': 'test', 'tested': 'test',
      'managing': 'manage', 'manages': 'manage', 'managed': 'manage',
      'analyzing': 'analyze', 'analyzes': 'analyze', 'analyzed': 'analyze',
      'implementing': 'implement', 'implements': 'implement', 'implemented': 'implement',
      'designing': 'design', 'designs': 'design', 'designed': 'design',
      'creating': 'create', 'creates': 'create', 'created': 'create',
      'planning': 'plan', 'plans': 'plan', 'planned': 'plan',
      'evaluating': 'evaluate', 'evaluates': 'evaluate', 'evaluated': 'evaluate',
      'monitoring': 'monitor', 'monitors': 'monitor', 'monitored': 'monitor',
      'assessing': 'assess', 'assesses': 'assess', 'assessed': 'assess',
      'understanding': 'understand', 'understands': 'understand', 'understood': 'understand',
      'applying': 'apply', 'applies': 'apply', 'applied': 'apply',
      'identifying': 'identify', 'identifies': 'identify', 'identified': 'identify',
      'configuring': 'configure', 'configures': 'configure', 'configured': 'configure',
      'securing': 'secure', 'secures': 'secure', 'secured': 'secure',
      
      // Nouns
      'processes': 'process', 'systems': 'system', 'technologies': 'technology',
      'methodologies': 'methodology', 'techniques': 'technique', 'skills': 'skill',
      'principles': 'principle', 'practices': 'practice', 'procedures': 'procedure',
      'applications': 'application', 'databases': 'database', 'networks': 'network',
      'frameworks': 'framework', 'tools': 'tool', 'methods': 'method',
      'strategies': 'strategy', 'environments': 'environment', 'solutions': 'solution',
      
      // Common IT/educational terms
      'competencies': 'competency', 'capabilities': 'capability', 'abilities': 'ability',
      'knowledge': 'knowledge', 'understanding': 'understanding', 'awareness': 'awareness',
      'proficiency': 'proficiency', 'expertise': 'expertise', 'mastery': 'mastery',
      'securities': 'security', 'vulnerabilities': 'vulnerability', 'threats': 'threat'
    };
    
    this.processedSkills = [];
    this.wordFrequency = {};
  }
  
  /**
   * Lemmatize a word - reduce it to its base form
   * @param {string} word - The word to lemmatize
   * @returns {string} - Lemmatized word
   */
  lemmatize(word) {
    // Basic word processing
    let result = word.toLowerCase();
    
    // Remove common punctuation
    result = result.replace(/[.,;:!?()'"]/g, '');
    
    // Check for direct mappings first
    if (this.lemRules[result]) return this.lemRules[result];
    
    // Simple plural handling for nouns
    if (result.endsWith('ies') && result.length > 3) {
      return result.slice(0, -3) + 'y';
    } else if (result.endsWith('es') && result.length > 2) {
      return result.slice(0, -2);
    } else if (result.endsWith('s') && !result.endsWith('ss') && result.length > 2) {
      return result.slice(0, -1);
    }
    
    // Handle common verb endings
    if (result.endsWith('ing') && result.length > 4) {
      return result.slice(0, -3);
    } else if (result.endsWith('ed') && result.length > 3) {
      return result.slice(0, -2);
    }
    
    return result;
  }
  
  /**
   * Normalize text by removing punctuation, extra spaces, etc.
   * @param {string} text - The text to normalize
   * @returns {string} - Normalized text
   */
  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[.,;:!?()'"]/g, ' ')  // Replace punctuation with spaces
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .trim();                       // Remove leading/trailing spaces
  }
  
  /**
   * Process a skill taxonomy and prepare it for matching
   * @param {Array} taxonomy - Array of skill objects from CSV
   * @param {string} skillNameField - Field name containing the skill name
   * @returns {Array} - Processed skills ready for matching
   */
  processSkillTaxonomy(taxonomy, skillNameField = 'Skill_name') {
    console.log(`Processing ${taxonomy.length} skills from taxonomy...`);
    
    // Reset word frequency counter
    this.wordFrequency = {};
    
    // Process each skill in the taxonomy
    this.processedSkills = taxonomy
      .filter(item => item[skillNameField] && item[skillNameField].trim().length > 0)
      .map(item => {
        const skillName = item[skillNameField].trim();
        const normalizedSkill = this.normalizeText(skillName);
        const words = normalizedSkill.split(' ').filter(w => w.length > 0);
        const lemmatizedWords = words.map(w => this.lemmatize(w));
        
        return {
          original: skillName,
          normalized: normalizedSkill,
          words: words.length,
          lemmatized: lemmatizedWords.join(' '),
          lemmatizedArray: lemmatizedWords
        };
      });
    
    // Sort skills by word length (longer first) for optimal matching
    this.processedSkills.sort((a, b) => b.words - a.words);
    
    // Calculate word frequency for specificity scoring
    this.processedSkills.forEach(skill => {
      skill.lemmatizedArray.forEach(word => {
        if (!this.stopwords.has(word)) {
          this.wordFrequency[word] = (this.wordFrequency[word] || 0) + 1;
        }
      });
    });
    
    console.log(`Processed ${this.processedSkills.length} valid skills`);
    return this.processedSkills;
  }
  
  /**
   * Extract skills from a single statement
   * @param {Object} statement - Statement object with ID and text
   * @param {string} textField - Field containing the statement text
   * @returns {Object} - Analysis results with matched skills and quality metrics
   */
  extractSkillsFromStatement(statement, textField = 'statement') {
    // Skip empty statements
    if (!statement[textField]) {
      return {
        id: statement.ID || statement.id,
        statement: '',
        matchedSkills: [],
        skillCount: 0,
        qualityScore: '0.00'
      };
    }
    
    // Preprocess the statement
    const statementText = statement[textField].trim();
    const normalizedStatement = this.normalizeText(statementText);
    const statementWords = normalizedStatement.split(' ').filter(w => w.length > 0);
    const lemmatizedStatementWords = statementWords.map(w => this.lemmatize(w));
    
    // Get statement keywords (non-stopwords) with their positions
    const keywordIndices = {};
    lemmatizedStatementWords.forEach((word, index) => {
      if (!this.stopwords.has(word) && word.length > 2) {
        if (!keywordIndices[word]) {
          keywordIndices[word] = [];
        }
        keywordIndices[word].push(index);
      }
    });
    
    // Find matching skills
    const foundSkills = [];
    const coveredPositions = new Set();
    
    // Function to check if a position range is already covered
    const isPositionCovered = (startPos, endPos) => {
      for (let i = startPos; i < endPos; i++) {
        if (coveredPositions.has(i)) return true;
      }
      return false;
    };
    
    // Helper to mark positions as covered
    const markPositions = (startPos, endPos) => {
      for (let i = startPos; i < endPos; i++) {
        coveredPositions.add(i);
      }
    };
    
    // Match multi-word skills first
    const multiWordSkills = this.processedSkills.filter(skill => skill.words > 1);
    
    for (const skill of multiWordSkills) {
      const skillWords = skill.lemmatizedArray;
      
      // Get the first non-stopword in the skill (as an anchor)
      let anchorWordIndex = -1;
      let anchorWord = '';
      for (let i = 0; i < skillWords.length; i++) {
        if (!this.stopwords.has(skillWords[i]) && skillWords[i].length > 2) {
          anchorWordIndex = i;
          anchorWord = skillWords[i];
          break;
        }
      }
      
      // Skip if no anchor word found or anchor word isn't in the statement
      if (anchorWordIndex === -1 || !keywordIndices[anchorWord]) continue;
      
      // For each occurrence of the anchor word in the statement
      for (const statementAnchorIndex of keywordIndices[anchorWord]) {
        const startPos = statementAnchorIndex - anchorWordIndex;
        const endPos = startPos + skillWords.length;
        
        // Skip if out of bounds or already covered
        if (startPos < 0 || endPos > lemmatizedStatementWords.length || isPositionCovered(startPos, endPos)) continue;
        
        // Check if this segment fully matches the skill
        let match = true;
        for (let j = 0; j < skillWords.length; j++) {
          const skillWord = skillWords[j];
          const statementWord = lemmatizedStatementWords[startPos + j];
          
          // If it's a stopword in the skill, we can be more lenient
          if (this.stopwords.has(skillWord)) continue;
          
          if (statementWord !== skillWord) {
            match = false;
            break;
          }
        }
        
        // If match found, add to results and mark positions as covered
        if (match) {
          // Extract original text from statement
          const originalText = statementWords.slice(startPos, endPos).join(' ');
          
          foundSkills.push({
            skill: skill.original,
            lemmatized: skill.lemmatized, 
            position: { start: startPos, end: endPos },
            words: skill.words,
            type: 'multi',
            original_text: originalText,
            specificity: (1 / (this.wordFrequency[anchorWord] || 1)) * skillWords.length // Prioritize rarer anchor words and longer phrases
          });
          
          markPositions(startPos, endPos);
        }
      }
    }
    
    // Match single-word skills
    const singleWordSkills = this.processedSkills.filter(skill => skill.words === 1);
    
    for (let i = 0; i < lemmatizedStatementWords.length; i++) {
      // Skip if position already covered
      if (coveredPositions.has(i)) continue;
      
      const statementWord = lemmatizedStatementWords[i];
      
      // Only consider meaningful words (exclude very short words or common stopwords)
      if (statementWord.length < 3 || this.stopwords.has(statementWord)) continue;
      
      // Find matching single-word skills
      for (const skill of singleWordSkills) {
        const skillWord = skill.lemmatizedArray[0];
        
        if (skillWord === statementWord) {
          foundSkills.push({
            skill: skill.original,
            lemmatized: skill.lemmatized,
            position: { start: i, end: i + 1 },
            words: 1,
            type: 'single',
            original_word: statementWords[i],
            specificity: 1 / (this.wordFrequency[skillWord] || 1) // Prioritize rarer words
          });
          
          markPositions(i, i + 1);
          break; // Only one skill per position
        }
      }
    }
    
    // Sort skills by position for readability
    const sortedFoundSkills = foundSkills.sort((a, b) => a.position.start - b.position.start);
    
    // Calculate quality metrics
    const wordCount = statementWords.length;
    const skillCount = sortedFoundSkills.length;
    const uniqueSkillCount = new Set(sortedFoundSkills.map(s => s.skill)).size;
    const skillDensity = skillCount / wordCount;
    const simpleSkills = sortedFoundSkills.filter(s => s.words === 1).length;
    const complexSkills = sortedFoundSkills.filter(s => s.words > 1).length;
    const complexityRatio = complexSkills / (skillCount || 1);
    
    // Calculate a weighted quality score that rewards rare/specific skills
    const specificityScore = sortedFoundSkills.reduce((sum, skill) => sum + (skill.specificity || 0), 0);
    
    // Quality score formula based on the documentation but with specificity bonus
    const qualityScore = (
      (0.6 * (skillCount / (wordCount / 10))) + // Skill density (scaled)
      (0.3 * complexityRatio) + // Complexity ratio
      (0.1 * specificityScore) // Specificity bonus
    ).toFixed(2);
    
    return {
      id: statement.ID || statement.id,
      type: statement.Type || statement.type,
      statement: statementText,
      wordCount,
      matchedSkills: sortedFoundSkills,
      skillCount,
      uniqueSkillCount,
      skillDensity: skillDensity.toFixed(4),
      simpleSkills,
      complexSkills,
      complexityRatio: complexityRatio.toFixed(2),
      specificityScore: specificityScore.toFixed(2),
      qualityScore
    };
  }
  
  /**
   * Process a batch of statements and extract skills from each
   * @param {Array} statements - Array of statement objects
   * @param {string} textField - Field containing the statement text
   * @returns {Object} - Results with individual analyses and overall statistics
   */
  processStatements(statements, textField = 'statement') {
    console.log(`Analyzing ${statements.length} statements...`);
    
    if (!this.processedSkills.length) {
      console.error('No processed skills available. Call processSkillTaxonomy() first.');
      return { results: [], summary: { error: 'No processed skills available' } };
    }
    
    // Process each statement
    const results = statements.map(statement => this.extractSkillsFromStatement(statement, textField));
    
    // Calculate overall statistics
    const totalSkillsMentioned = results.reduce((sum, r) => sum + r.skillCount, 0);
    const avgSkillsPerStatement = totalSkillsMentioned / results.length;
    const statementsWithSkills = results.filter(r => r.skillCount > 0).length;
    const statementsWithoutSkills = results.filter(r => r.skillCount === 0).length;
    const avgQualityScore = results.reduce((sum, r) => sum + parseFloat(r.qualityScore), 0) / results.length;
    
    // Group by statement type (if available)
    const typeStats = {};
    const typeGroups = {};
    
    results.forEach(result => {
      const type = result.type || 'Unknown';
      
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      
      typeGroups[type].push(result);
    });
    
    // Calculate type-specific statistics
    for (const type in typeGroups) {
      const typeStatements = typeGroups[type];
      const withSkills = typeStatements.filter(s => s.skillCount > 0).length;
      const avgSkills = typeStatements.reduce((sum, s) => sum + s.skillCount, 0) / typeStatements.length;
      const avgQuality = typeStatements.reduce((sum, s) => sum + parseFloat(s.qualityScore), 0) / typeStatements.length;
      
      typeStats[type] = {
        count: typeStatements.length,
        withSkills,
        withoutSkills: typeStatements.length - withSkills,
        percentWithSkills: ((withSkills / typeStatements.length) * 100).toFixed(2),
        avgSkillsPerStatement: avgSkills.toFixed(2),
        avgQualityScore: avgQuality.toFixed(2)
      };
    }
    
    // Get the most common skills found
    const skillFrequency = {};
    results.forEach(result => {
      result.matchedSkills.forEach(skill => {
        skillFrequency[skill.skill] = (skillFrequency[skill.skill] || 0) + 1;
      });
    });
    
    // Sort skills by frequency
    const topSkills = Object.entries(skillFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)  // Get top 20
      .map(([skill, count]) => ({ skill, count }));
    
    // Create summary
    const summary = {
      totalStatements: results.length,
      statementsWithSkills,
      statementsWithoutSkills,
      percentWithSkills: ((statementsWithSkills / results.length) * 100).toFixed(2),
      avgSkillsPerStatement: avgSkillsPerStatement.toFixed(2),
      totalSkillsMentioned,
      uniqueSkillsMentioned: Object.keys(skilluniqueSkillsMentioned: Object.keys(skillFrequency).length,
      avgQualityScore: avgQualityScore.toFixed(2),
      typeStats,
      topSkills
    };
    
    return {
      results,
      summary
    };
  }
  
  /**
   * Generate a highlighted HTML representation of a statement with matched skills
   * @param {Object} analysisResult - The result from extractSkillsFromStatement
   * @returns {string} - HTML string with highlighted skills
   */
  generateHighlightedHTML(analysisResult) {
    if (!analysisResult.statement || !analysisResult.matchedSkills || !analysisResult.matchedSkills.length) {
      return `<p>${analysisResult.statement || ''}</p>`;
    }
    
    const statementWords = this.normalizeText(analysisResult.statement).split(' ');
    
    // Create a map of positions to skill information
    const positionMap = new Map();
    
    analysisResult.matchedSkills.forEach(skill => {
      const { start, end } = skill.position;
      for (let i = start; i < end; i++) {
        positionMap.set(i, {
          isStart: i === start,
          isEnd: i === end - 1,
          skill: skill.skill,
          type: skill.type,
          words: skill.words,
          specificity: skill.specificity
        });
      }
    });
    
    // Generate HTML with highlights
    let html = '<p>';
    let isInsideHighlight = false;
    
    statementWords.forEach((word, index) => {
      const skillInfo = positionMap.get(index);
      
      if (skillInfo && skillInfo.isStart) {
        // Start of a skill - determine highlight color based on type/specificity
        const opacity = Math.min(0.9, 0.3 + (skillInfo.specificity * 0.7));
        const bgColor = skillInfo.words > 1 ? `rgba(0, 128, 255, ${opacity})` : `rgba(255, 165, 0, ${opacity})`;
        
        html += `<span class="skill-highlight" style="background-color: ${bgColor};" title="${skillInfo.skill}">`;
        isInsideHighlight = true;
      }
      
      // Add the word
      html += word;
      
      if (skillInfo && skillInfo.isEnd) {
        // End of a skill
        html += '</span>';
        isInsideHighlight = false;
      }
      
      // Add space between words (except for the last word)
      if (index < statementWords.length - 1) {
        html += ' ';
      }
    });
    
    html += '</p>';
    return html;
  }
  
  /**
   * Generate a quality rating description based on the quality score
   * @param {string|number} qualityScore - The quality score
   * @returns {string} - Quality rating description
   */
  getQualityRating(qualityScore) {
    const score = parseFloat(qualityScore);
    
    if (score <= 0.25) {
      return "Poor quality - few skills, mostly generic";
    } else if (score <= 0.50) {
      return "Basic quality - some skills, mix of generic and specific";
    } else if (score <= 0.75) {
      return "Good quality - good skills coverage, more specific skills";
    } else if (score <= 1.25) {
      return "Very good quality - high skills coverage, mostly specific skills";
    } else {
      return "Excellent quality - exceptional skills coverage and specificity";
    }
  }
}

export default SkillsExtractionTool;
                                         
