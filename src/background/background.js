chrome.runtime.onInstalled.addListener(() => {
  console.log('Job Application Assistant installed');
  chrome.storage.local.set({
    applications: 0,
    successRate: 0,
    jobsScanned: 0,
    cvTemplates: [],
    coverLetterTemplates: [],
    userProfile: null
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanJobPage') {  
    processJobScan(request.data).then(sendResponse);
    return true; 
  }
  
  if (request.action === 'autoApply') {
    processAutoApply(request.data).then(sendResponse);
    return true;
  }
  
  if (request.action === 'getUserData') {
    chrome.storage.local.get('userProfile').then((result) => {
      sendResponse(result.userProfile);
    });
    return true;
  }
  
  if (request.action === 'saveUserData') {
    chrome.storage.local.set({userProfile: request.data}).then(() => {
      sendResponse({success: true});
    });
    return true;
  }
});

async function processJobScan(data) {
  return {
    score: Math.floor(Math.random() * 100),
    recommendations: [
      "Add more industry-specific keywords",
      "Include quantifiable achievements",
      "Tailor your experience to match job requirements"
    ],
    keywords: ["JavaScript", "React", "Node.js", "API Development"]
  };
}

async function processAutoApply(data) {
  console.log('Auto-applying with data:', data);

  const result = await chrome.storage.local.get('applications');
  const currentCount = result.applications || 0;
  await chrome.storage.local.set({applications: currentCount + 1});
  
  return { success: true, message: "Application submitted successfully" };
}

