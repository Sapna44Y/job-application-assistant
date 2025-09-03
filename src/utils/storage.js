
export const getStats = async () => {
  const result = await chrome.storage.local.get([
    'applications', 
    'successRate', 
    'jobsScanned'
  ]);
  
  return {
    applications: result.applications || 0,
    successRate: result.successRate || 0,
    jobsScanned: result.jobsScanned || 0
  };
};

export const updateStats = async (newStats) => {
  const currentStats = await getStats();
  const updatedStats = { ...currentStats, ...newStats };
  await chrome.storage.local.set(updatedStats);
  return updatedStats;
};

export const incrementApplications = async () => {
  const stats = await getStats();
  const newCount = stats.applications + 1;
  await updateStats({ applications: newCount });
  return newCount;
};

export const incrementJobsScanned = async () => {
  const stats = await getStats();
  const newCount = stats.jobsScanned + 1;
  await updateStats({ jobsScanned: newCount });
  return newCount;
};

export const updateSuccessRate = async (successRate) => {
  await updateStats({ successRate });
};