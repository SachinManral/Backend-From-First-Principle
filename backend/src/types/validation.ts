export interface ValidationError {
  field: string;
  expected: string;
  received: string | null;
  message: string;
  type: 'type' | 'syntactic' | 'semantic' | 'complex';
}

export interface ValidationPipelineResult {
  status: number;
  verdict: string;
  errorCount?: number;
  explanation?: string;
  errors?: ValidationError[];
  message?: string;
  sanitizedPayload?: Record<string, any>;
  simulatedDatabaseAction: string;
}

export interface TransformationResult {
  status: number;
  verdict: string;
  pipelineComparison: {
    rawInput: Record<string, any>;
    transformedOutput: Record<string, any>;
  };
  transformationsApplied: Array<{ field: string; action: string }>;
  serviceLayerBenefit: string;
}
