chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanJobPage') {
    const scanResult = scanCurrentPage();
    sendResponse(scanResult);
  }
  
  if (request.action === 'generateCv') {
    const jobData = extractJobData();
    const cvResult = generateCv(jobData, request.templateId, request.customizations);
    sendResponse(cvResult);
  }
  
  if (request.action === 'generateCoverLetter') {
    const jobData = extractJobData();
    const letterResult = generateCoverLetter(jobData, request.templateId, request.options);
    sendResponse(letterResult);
  }
  
  if (request.action === 'autoApply') {
    const applicationResult = autoApplyToJob(request.applicationData);
    sendResponse(applicationResult);
  }
  
  return true;
});

function scanCurrentPage() {
 
  const jobData = extractJobData();
 
  const score = calculateAtsScore(jobData);
  const recommendations = generateRecommendations(jobData);
  const keywords = extractKeywords(jobData);
 
  chrome.runtime.sendMessage({ action: 'incrementJobsScanned' });
  
  return {
    score,
    recommendations,
    keywords
  };
}

function extractJobData() {
 
  const title = document.querySelector('h1')?.innerText || 'Job Title';
  const company = document.querySelector('[class*="company"]')?.innerText || 'Company Name';
  const description = document.querySelector('[class*="description"]')?.innerText || document.body.innerText;
  
  return {
    title,
    company,
    description
  };
}

function calculateAtsScore(jobData) {
  const keywordCount = (jobData.description.match(/\b(react|javascript|node|python|java|html|css)\b/gi) || []).length;
  return Math.min(100, 30 + (keywordCount * 10));
}

function generateRecommendations(jobData) {
  const recommendations = [];
  
  if (jobData.description.length < 1000) {
    recommendations.push("Add more detail to your job description");
  }
  
  if (!jobData.description.match(/\d/)) {
    recommendations.push("Include quantifiable achievements with numbers");
  }
  
  if ((jobData.description.match(/\b(react|javascript|node)\b/gi) || []).length < 2) {
    recommendations.push("Add more technical keywords relevant to the position");
  }
  
  return recommendations.length > 0 ? recommendations : ["Your profile looks good for this position!"];
}

function extractKeywords(jobData) {
  const commonKeywords = ['javascript', 'react', 'node', 'python', 'html', 'css', 'api', 'database', 'frontend', 'backend'];
  const foundKeywords = commonKeywords.filter(keyword => 
    jobData.description.toLowerCase().includes(keyword)
  );
  
  return foundKeywords.slice(0, 5);
}

function generateCv(jobData, templateId, customizations) {
 
  return {
    downloadUrl: 'https://example.com/generated-cv.pdf',
    preview: 'CV successfully tailored for ' + jobData.title + ' at ' + jobData.company
  };
}

function generateCoverLetter(jobData, templateId, options) {
  return {
    downloadUrl: 'https://example.com/cover-letter.pdf',
    preview: 'Dear Hiring Manager, I am excited to apply for the ' + jobData.title + ' position at ' + jobData.company + '...'
  };
}

function autoApplyToJob(applicationData) {
  console.log('Auto-applying with data:', applicationData);
  chrome.runtime.sendMessage({ action: 'incrementApplications' });
  
  return { success: true, message: "Application submitted successfully" };
}