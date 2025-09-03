
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
  
  if (request.action === 'parseJobDetails') {
    const jobDetails = parseJobDetailsFromPage();
    sendResponse(jobDetails);
  }
  
  if (request.action === 'extractCompanyInfo') {
    const companyInfo = extractCompanyInfoFromPage();
    sendResponse(companyInfo);
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
    keywords,
    jobData
  };
}

function extractJobData() {

  let title = document.querySelector('h1')?.innerText || 
              document.querySelector('[class*="title"]')?.innerText || 
              document.querySelector('[class*="job-title"]')?.innerText || 
              'Job Title';

  let company = document.querySelector('[class*="company"]')?.innerText || 
                document.querySelector('[class*="employer"]')?.innerText || 
                document.querySelector('[class*="organization"]')?.innerText || 
                'Company Name';
 
  let description = document.querySelector('[class*="description"]')?.innerText || 
                    document.querySelector('[class*="content"]')?.innerText || 
                    document.querySelector('body')?.innerText || 
                    '';

  let location = document.querySelector('[class*="location"]')?.innerText || 
                 document.querySelector('[class*="address"]')?.innerText || 
                 'Location not specified';
  
  return {
    title: title.trim(),
    company: company.trim(),
    description: description.trim(),
    location: location.trim(),
    url: window.location.href
  };
}

function parseJobDetailsFromPage() {
  const jobData = extractJobData();

  if (window.location.hostname.includes('linkedin')) {
    return parseLinkedInJob(jobData);
  } else if (window.location.hostname.includes('indeed')) {
    return parseIndeedJob(jobData);
  } else if (window.location.hostname.includes('glassdoor')) {
    return parseGlassdoorJob(jobData);
  }
  
  return jobData;
}

function parseLinkedInJob(jobData) {
  try {
    const salaryElement = document.querySelector('[class*="salary"]');
    if (salaryElement) {
      jobData.salary = salaryElement.innerText.trim();
    }
    
    const employmentTypeElement = document.querySelector('[class*="employment-type"]');
    if (employmentTypeElement) {
      jobData.employmentType = employmentTypeElement.innerText.trim();
    }
  } catch (error) {
    console.error('Error parsing LinkedIn job:', error);
  }
  
  return jobData;
}

function parseIndeedJob(jobData) {
  try {
    const ratingElement = document.querySelector('[class*="rating"]');
    if (ratingElement) {
      jobData.companyRating = ratingElement.innerText.trim();
    }
  } catch (error) {
    console.error('Error parsing Indeed job:', error);
  }
  
  return jobData;
}

function parseGlassdoorJob(jobData) {
  try {
    const reviewsElement = document.querySelector('[class*="reviews"]');
    if (reviewsElement) {
      jobData.companyReviews = reviewsElement.innerText.trim();
    }
  } catch (error) {
    console.error('Error parsing Glassdoor job:', error);
  }
  
  return jobData;
}

function extractCompanyInfoFromPage() {
  let companyInfo = {
    name: '',
    website: '',
    industry: '',
    size: '',
    about: ''
  };
  
  try {
    companyInfo.name = document.querySelector('[class*="company-name"]')?.innerText || 
                       document.querySelector('[class*="employer"]')?.innerText || 
                       '';
    
    const websiteLink = document.querySelector('a[href*="http"]');
    if (websiteLink) {
      companyInfo.website = websiteLink.href;
    }
    
    companyInfo.about = document.querySelector('[class*="about"]')?.innerText || 
                        document.querySelector('[class*="description"]')?.innerText || 
                        '';
  } catch (error) {
    console.error('Error extracting company info:', error);
  }
  
  return companyInfo;
}

function calculateAtsScore(jobData) {
  let score = 30;

  if (jobData.description.length > 1000) score += 10;
  if (jobData.description.length > 2000) score += 10;

  const techKeywords = ['javascript', 'react', 'node', 'python', 'html', 'css', 'api', 'database'];
  const foundKeywords = techKeywords.filter(keyword => 
    jobData.description.toLowerCase().includes(keyword)
  );
  score += foundKeywords.length * 5;
 
  const numberCount = (jobData.description.match(/\d+/g) || []).length;
  score += Math.min(numberCount * 2, 10);
  
  return Math.min(100, score);
}

function generateRecommendations(jobData) {
  const recommendations = [];
  
  if (jobData.description.length < 1000) {
    recommendations.push("Add more detail to your job description");
  }
  
  if (!jobData.description.match(/\d/)) {
    recommendations.push("Include quantifiable achievements with numbers");
  }
  
  const techKeywords = ['javascript', 'react', 'node', 'python', 'html', 'css'];
  const foundKeywords = techKeywords.filter(keyword => 
    jobData.description.toLowerCase().includes(keyword)
  );
  
  if (foundKeywords.length < 2) {
    recommendations.push("Add more technical keywords relevant to the position");
  }
  
  return recommendations.length > 0 ? recommendations : ["Your profile looks good for this position!"];
}

function extractKeywords(jobData) {
  const commonKeywords = ['javascript', 'react', 'node', 'python', 'html', 'css', 'api', 'database', 'frontend', 'backend', 'development', 'software', 'engineer', 'developer', 'web', 'application', 'cloud', 'aws', 'azure', 'git', 'agile', 'scrum'];
  const foundKeywords = commonKeywords.filter(keyword => 
    jobData.description.toLowerCase().includes(keyword)
  );
  
  return foundKeywords.slice(0, 10);
}

function generateCv(jobData, templateId, customizations) {
  return {
    downloadUrl: 'https://example.com/generated-cv.pdf',
    preview: 'CV successfully tailored for ' + jobData.title + ' at ' + jobData.company,
    templateId,
    customizations
  };
}

function generateCoverLetter(jobData, templateId, options) {
 
  return {
    downloadUrl: 'https://example.com/cover-letter.pdf',
    preview: 'Dear Hiring Manager, I am excited to apply for the ' + jobData.title + ' position at ' + jobData.company + '...',
    templateId,
    options
  };
}

function autoApplyToJob(applicationData) {
  console.log('Auto-applying with data:', applicationData);
  
  chrome.runtime.sendMessage({ action: 'incrementApplications' });
  
  return { success: true, message: "Application submitted successfully" };
}


