export interface BookRecord {
  id: string;
  title: string;
  author: string;
  userId: string;
  sortOrder: number;
  createdAt: string;
}

export interface RequestTraceStep {
  step: number;
  layer: string;
  action: string;
  metadata: Record<string, any>;
}

export interface RequestContextData {
  requestId: string;
  userId: string;
  role: string;
  clientIp: string;
  receivedAt: string;
}
