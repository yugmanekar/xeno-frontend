const API = 'http://localhost:3001/api';

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

async function apiPost<T>(path: string, data?: any): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// Customers
export const getCustomers = (params?: string) => apiGet<any>(`/customers${params ? `?${params}` : ''}`);
export const getCustomer = (id: string) => apiGet<any>(`/customers/${id}`);
export const getCustomerStats = () => apiGet<any>('/customers/stats');
export const getPersonas = () => apiGet<any>('/customers/personas');

// Orders
export const getOrderStats = () => apiGet<any>('/orders/stats');
export const getRevenueTimeline = () => apiGet<any>('/orders/timeline');
export const getCategories = () => apiGet<any>('/orders/categories');

// Campaigns
export const getCampaigns = () => apiGet<any>('/campaigns');
export const getCampaign = (id: string) => apiGet<any>(`/campaigns/${id}`);
export const createCampaign = (data: any) => apiPost<any>('/campaigns', data);
export const launchCampaign = (id: string) => apiPost<any>(`/campaigns/${id}/launch`);
export const simulateCampaign = (id: string) => apiPost<any>(`/campaigns/${id}/simulate`);
export const generateCopy = (data: any) => apiPost<any>('/campaigns/generate-copy', data);

// Segments
export const parseSegment = (query: string) => apiPost<any>('/segments/parse', { query });
export const executeSegment = (sql: string) => apiPost<any>('/segments/execute', { sql });
export const getSegments = () => apiGet<any>('/segments');
export const saveSegment = (data: any) => apiPost<any>('/segments', data);

// AI
export const getInsights = () => apiPost<any>('/ai/insights');
export const askStrategy = (question: string) => apiPost<any>('/ai/strategy', { question });
export const explainAI = (topic: string, context?: any) => apiPost<any>('/ai/explain', { topic, context });
export const predictAI = (data?: any) => apiPost<any>('/ai/predict', data || {});
export const detectOpportunity = () => apiPost<any>('/ai/opportunity');
export const whatIf = (data: any) => apiPost<any>('/ai/what-if', data);

// Memory
export const getMemories = (type?: string) => apiGet<any>(`/memory${type ? `?type=${type}` : ''}`);
export const getMemorySummary = () => apiGet<any>('/memory/summary');

// Events
export const getEvents = (limit?: number, type?: string) =>
  apiGet<any>(`/events?limit=${limit || 50}${type ? `&type=${type}` : ''}`);

// Analytics
export const getOverview = () => apiGet<any>('/analytics/overview');
export const getRevenue = () => apiGet<any>('/analytics/revenue');
export const getRetention = () => apiGet<any>('/analytics/retention');
export const getChannels = () => apiGet<any>('/analytics/channels');
export const getGeographic = () => apiGet<any>('/analytics/geographic');
export const getFunnel = () => apiGet<any>('/analytics/funnel');

// Onboarding
export const setupWorkspace = (data: any) => apiPost<any>('/onboarding/setup', data);
