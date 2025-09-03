export const scanJobPage = async (tabId) => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: "scanJobPage" }, (response) => {
      resolve(response);
    });
  });
};

export const generateCv = async (tabId, templateId, customizations) => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { action: "generateCv", templateId, customizations },
      (response) => {
        resolve(response);
      }
    );
  });
};

export const generateCvPdf = async (cvData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPdfContent = `
        <html>
          <head><title>Generated CV</title></head>
          <body>
            <h1>${cvData.content.personalInfo.name}'s CV</h1>
            <p>Generated with ApplyGOAT</p>
          </body>
        </html>
      `;
      const blob = new Blob([mockPdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, 1000);
  });
};



export const getLetterTemplates = async () => {
  const result = await chrome.storage.local.get(["coverLetterTemplates"]);
  return (
    result.coverLetterTemplates || [
      { id: "1", name: "Standard Professional" },
      { id: "2", name: "Enthusiastic" },
      { id: "3", name: "Executive" },
    ]
  );
};

export const saveLetterTemplate = async (template) => {
  const result = await chrome.storage.local.get(["coverLetterTemplates"]);
  const templates = result.coverLetterTemplates || [];
  templates.push(template);
  await chrome.storage.local.set({ coverLetterTemplates: templates });
  return template;
};


export const generateCoverLetter = async (formData) => {
  const {
    fullName,
    jobTitle,
    experienceLevel,
    prevRole,
    prevCompany,
    prevJobDetails,
    education,
    skills = [],
    phone,
    email,
    github,
    linkedin,
    tone,
    keyPoints,
  } = formData;

  let toneIntro = "";
  switch (tone) {
    case "enthusiastic":
      toneIntro = "I am very excited to apply for the role of";
      break;
    case "formal":
      toneIntro =
        "I am writing to formally express my interest in the position of";
      break;
    case "conversational":
      toneIntro = "I’m reaching out to share my interest in the";
      break;
    default:
      toneIntro = "I am applying for the position of";
  }

  const letterText = `
Dear Hiring Manager,

${toneIntro} ${jobTitle}. With my ${experienceLevel} experience, I believe I can bring strong value to your team.

${
  prevRole && prevCompany
    ? `Previously, I worked as a ${prevRole} at ${prevCompany}, where I was responsible for ${prevJobDetails}.`
    : ""
}

My background includes education in ${education}, and I have developed expertise in the following skills: ${skills.join(
    ", "
  )}.

${keyPoints ? `Key highlights I would like to emphasize: ${keyPoints}.` : ""}

I would welcome the opportunity to contribute to your organization and discuss how my experience aligns with your goals.

Thank you for considering my application. I look forward to your response.

Sincerely,  
${fullName}  
Phone: ${phone}  
Email: ${email}  
${github ? `GitHub: ${github}` : ""}  
${linkedin ? `LinkedIn: ${linkedin}` : ""}
`;

  return {
    preview: letterText,
    downloadUrl: createPdfDownload(letterText),
  };
};

const createPdfDownload = (text) => {
  const blob = new Blob([text], { type: "application/pdf" });
  return URL.createObjectURL(blob);
};



export const findJobs = async (preferences) => {
  const mockJobs = [
    {
      id: "1",
      title: "Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA (Remote)",
      salaryMin: 90000,
      salaryMax: 130000,
      posted: "2 days ago",
      description:
        "Looking for a skilled Frontend Developer with React and TypeScript experience.",
      url: "https://example.com/job/1",
    },
    {
      id: "2",
      title: "UX/UI Designer",
      company: "Creative Solutions LLC",
      location: "New York, NY",
      salaryMin: 85000,
      salaryMax: 110000,
      posted: "5 days ago",
      description:
        "Join our design team to create beautiful and functional user interfaces.",
      url: "https://example.com/job/2",
    },
    {
      id: "3",
      title: "Full Stack Developer",
      company: "Digital Transformers",
      location: "Austin, TX (Hybrid)",
      salaryMin: 100000,
      salaryMax: 140000,
      posted: "1 week ago",
      description:
        "Hiring a full stack developer with Node.js and React experience.",
      url: "https://example.com/job/3",
    },
    {
      id: "4",
      title: "Data Scientist",
      company: "AI Analytics Co.",
      location: "Boston, MA",
      salaryMin: 110000,
      salaryMax: 150000,
      posted: "3 days ago",
      description:
        "We are seeking a Data Scientist experienced in Python, TensorFlow, and machine learning.",
      url: "https://example.com/job/4",
    },
    {
      id: "5",
      title: "Backend Engineer",
      company: "Cloud Systems",
      location: "Seattle, WA",
      salaryMin: 95000,
      salaryMax: 125000,
      posted: "1 day ago",
      description:
        "Strong Java, Spring Boot, and microservices experience required.",
      url: "https://example.com/job/5",
    },
    {
      id: "6",
      title: "React Developer",
      company: "Appify",
      location: "Remote",
      salaryMin: 80000,
      salaryMax: 110000,
      posted: "6 days ago",
      description:
        "Looking for iOS/Android developer with Flutter experience.",
      url: "https://example.com/job/6",
    },
    {
      id: "7",
      title: "DevOps Engineer",
      company: "NextGen Cloud",
      location: "Chicago, IL",
      salaryMin: 105000,
      salaryMax: 140000,
      posted: "4 days ago",
      description:
        "AWS, Kubernetes, and CI/CD pipeline automation required.",
      url: "https://example.com/job/7",
    },
    {
      id: "8",
      title: "Product Manager",
      company: "Global Tech Ltd.",
      location: "London, UK",
      salaryMin: 70000,
      salaryMax: 100000,
      posted: "2 weeks ago",
      description:
        "Lead product strategy and roadmap for a SaaS platform.",
      url: "https://example.com/job/8",
    },
    {
      id: "9",
      title: "Cybersecurity Analyst",
      company: "SecureNet",
      location: "Remote",
      salaryMin: 95000,
      salaryMax: 135000,
      posted: "3 days ago",
      description:
        "Expert in network security, firewalls, and vulnerability testing.",
      url: "https://example.com/job/9",
    },
    {
      id: "10",
      title: "React Developer",
      company: "DeepMind Labs",
      location: "San Francisco, CA",
      salaryMin: 130000,
      salaryMax: 180000,
      posted: "1 week ago",
      description:
        "Research in deep learning, NLP, and reinforcement learning.",
      url: "https://example.com/job/10",
    },
    {
      id: "11",
      title: "Marketing Specialist",
      company: "BrandBoost",
      location: "Remote",
      salaryMin: 60000,
      salaryMax: 85000,
      posted: "2 days ago",
      description:
        "Digital marketing expert with SEO/SEM experience required.",
      url: "https://example.com/job/11",
    },
    {
      id: "12",
      title: "Game Developer",
      company: "Pixel Studios",
      location: "Los Angeles, CA",
      salaryMin: 80000,
      salaryMax: 120000,
      posted: "5 days ago",
      description:
        "Unreal Engine and Unity experience required for next-gen games.",
      url: "https://example.com/job/12",
    },
    {
      id: "13",
      title: "Blockchain Engineer",
      company: "CryptoX",
      location: "Remote",
      salaryMin: 110000,
      salaryMax: 150000,
      posted: "6 days ago",
      description:
        "Smart contracts, Solidity, and DeFi background preferred.",
      url: "https://example.com/job/13",
    },
    {
      id: "14",
      title: "System Administrator",
      company: "IT Solutions",
      location: "Denver, CO",
      salaryMin: 70000,
      salaryMax: 95000,
      posted: "1 week ago",
      description:
        "Linux, Windows Server, and cloud infrastructure management.",
      url: "https://example.com/job/14",
    },
    {
      id: "15",
      title: "Technical Writer",
      company: "DocuTech",
      location: "Remote",
      salaryMin: 65000,
      salaryMax: 90000,
      posted: "4 days ago",
      description:
        "Write clear technical documentation for developers and end users.",
      url: "https://example.com/job/15",
    },
    {
      id: "16",
      title: "Cloud Architect",
      company: "SkyNet Systems",
      location: "Austin, TX",
      salaryMin: 120000,
      salaryMax: 160000,
      posted: "3 days ago",
      description:
        "AWS, Azure, and GCP multi-cloud experience required.",
      url: "https://example.com/job/16",
    },
    {
      id: "17",
      title: "Business Analyst",
      company: "Insight Corp",
      location: "New York, NY",
      salaryMin: 75000,
      salaryMax: 105000,
      posted: "2 weeks ago",
      description:
        "Analyze business processes and deliver technology-driven solutions.",
      url: "https://example.com/job/17",
    },
    {
      id: "18",
      title: "HR Manager",
      company: "PeopleFirst",
      location: "Remote",
      salaryMin: 65000,
      salaryMax: 95000,
      posted: "5 days ago",
      description:
        "Manage recruitment, employee relations, and HR strategy.",
      url: "https://example.com/job/18",
    },
    {
      id: "19",
      title: "Finance Analyst",
      company: "MoneyMatters",
      location: "Chicago, IL",
      salaryMin: 70000,
      salaryMax: 100000,
      posted: "6 days ago",
      description:
        "Financial modeling, budgeting, and forecasting required.",
      url: "https://example.com/job/19",
    },
    {
      id: "20",
      title: "Operations Manager",
      company: "LogiTech",
      location: "Dallas, TX",
      salaryMin: 85000,
      salaryMax: 120000,
      posted: "1 week ago",
      description:
        "Oversee daily operations and optimize workflows.",
      url: "https://example.com/job/20",
    },
  ];

  if (preferences?.keywords) {
    const keywordFilter = preferences.keywords.toLowerCase();
    return mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(keywordFilter) ||
        job.description.toLowerCase().includes(keywordFilter)
    );
  }

  return mockJobs;
};

export const getCvTemplates = async () => {
  const result = await chrome.storage.local.get(["cvTemplates"]);
  return (
    result.cvTemplates || [
      { id: "1", name: "Professional", color: "#2c3e50" },
      { id: "2", name: "Modern", color: "#4a6fa5" },
      { id: "3", name: "Creative", color: "#e74c3c" },
    ]
  );
};

export const saveCvTemplate = async (template) => {
  const result = await chrome.storage.local.get(["cvTemplates"]);
  const templates = result.cvTemplates || [];
  templates.push(template);
  await chrome.storage.local.set({ cvTemplates: templates });
  return template;
};


export const saveJobPreferences = async (preferences) => {
  await chrome.storage.local.set({ jobPreferences: preferences });
};

export const getJobPreferences = async () => {
  const result = await chrome.storage.local.get(["jobPreferences"]);
  return (
    result.jobPreferences || {
      keywords: "",
      location: "",
      remote: true,
      salaryMin: 50000,
      experienceLevel: "mid",
    }
  );
};

export const autoApplyToJob = async (jobData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Application submitted successfully",
        applicationId: `app-${Date.now()}`,
      });
    }, 2000);
  });
};

export const getApplicationHistory = async () => {
  const result = await chrome.storage.local.get(["applicationHistory"]);
  return result.applicationHistory || [];
};

export const saveApplication = async (application) => {
  const result = await chrome.storage.local.get(["applicationHistory"]);
  const history = result.applicationHistory || [];
  history.push({
    id: `app-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...application,
  });
  await chrome.storage.local.set({ applicationHistory: history });
  return history;
};


export const sendMessageToContentScript = async (tabId, message) => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      resolve(response);
    });
  });
};

export const parseJobDetails = async (tabId) => {
  return sendMessageToContentScript(tabId, { action: "parseJobDetails" });
};

export const extractCompanyInfo = async (tabId) => {
  return sendMessageToContentScript(tabId, { action: "extractCompanyInfo" });
};

export const trackEvent = async (eventName, eventData = {}) => {
  console.log("Tracking event:", eventName, eventData);
  return true;
};


export const getUserProfile = async () => {
  const result = await chrome.storage.local.get(["userProfile"]);
  return (
    result.userProfile || {
      name: "",
      email: "",
      phone: "",
      location: "",
      resumeText: "",
      skills: [],
      experience: [],
    }
  );
};

export const saveUserProfile = async (profile) => {
  await chrome.storage.local.set({ userProfile: profile });
  return profile;
};

export const isPremiumUser = async () => {
  const result = await chrome.storage.local.get(["userStatus"]);
  return result.userStatus?.isPremium || false;
};

export const getExtensionSettings = async () => {
  const result = await chrome.storage.local.get(["extensionSettings"]);
  return (
    result.extensionSettings || {
      autoFillForms: true,
      autoSubmit: false,
      defaultTemplate: "1",
      notifications: true,
    }
  );
};

export const saveExtensionSettings = async (settings) => {
  await chrome.storage.local.set({ extensionSettings: settings });
  return settings;
};
