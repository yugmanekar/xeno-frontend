export interface Customer {
  id: string; name: string; email: string; phone: string;
  location: string; gender: string; age: number;
  preferences: string; total_spend: number; avg_order: number;
  order_frequency: number; last_purchase: string;
  engagement_score: number; predicted_churn: number;
  predicted_clv: number; favorite_channel: string;
  favorite_category: string; persona: string; created_at: string;
}

export interface Order {
  id: string; customer_id: string; product: string;
  category: string; amount: number; discount: number;
  payment_method: string; location: string; timestamp: string;
  customer_name?: string;
}

export interface Campaign {
  id: string; name: string; segment_query: string;
  segment_logic: string; audience_size: number;
  channel: string; tone: string; message: string;
  variants: string; status: string;
  ai_reasoning: string; predicted_ctr: number;
  predicted_revenue: number; actual_ctr: number;
  actual_revenue: number; created_at: string;
  completed_at: string;
  deliveryStats?: DeliveryStats;
}

export interface DeliveryStats {
  total: number; delivered: number; opened: number;
  clicked: number; converted: number; failed: number;
}

export interface Delivery {
  id: string; campaign_id: string; customer_id: string;
  channel: string; status: string; message: string;
  sent_at: string; delivered_at: string; opened_at: string;
  clicked_at: string; converted_at: string; failed_at: string;
  retry_count: number; customer_name?: string;
}

export interface AIMemory {
  id: string; type: string; title: string; content: string;
  confidence: number; source: string; impact: string;
  tags: string; created_at: string;
}

export interface XenoEvent {
  id: string; type: string; title: string; description: string;
  metadata: string; created_at: string;
}

export interface Segment {
  id: string; name: string; natural_query: string;
  parsed_logic: string; customer_count: number;
  ai_reasoning: string; created_at: string;
}

export interface AIInsight {
  id: string; type: 'warning' | 'opportunity' | 'success' | 'info';
  title: string; description: string; value?: string;
  confidence: number; action: string; actionLabel: string;
}

export interface PersonaGroup {
  persona: string; count: number; avgSpend: number;
  avgEngagement: number; avgChurn: number; avgClv?: number;
}

export interface AnalyticsOverview {
  totalCustomers: number; totalRevenue: number;
  avgOrderValue: number; activeCampaigns: number;
  avgEngagement: number; churnRate: number;
  repeatRate: number; topChannel: string;
  totalOrders?: number; highRiskCount?: number; vipCount?: number;
}

export interface CopyVariant {
  id: string; message: string; predictedCtr: number;
  tone: string; rank: number;
}

export interface StrategyResponse {
  analysis: string;
  problems: string[];
  recommendations: Array<{
    title: string; description: string;
    estimatedImpact: string; confidence: number;
  }>;
  chartData: Array<{ month: string; rate: number }>;
}

export interface SegmentParseResult {
  reasoning: string;
  logic: { conditions: string[] };
  sql: string;
  estimatedSize: number;
  expectedConversion: number;
  risk: string;
}
