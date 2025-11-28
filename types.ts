export enum AppMode {
  GENERAL = 'GENERAL',
  GRAPHING = 'GRAPHING',
  SOLVER = 'SOLVER', // Calculus, Algebra, etc.
  STATISTICS = 'STATISTICS'
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface SolveResult {
  solutionMarkdown: string;
  finalAnswer: string;
  isGraphable: boolean;
  graphData?: GraphPoint[];
  bennyComment: string;
  type: 'math' | 'chat';
}

export interface HistoryItem {
  id: string;
  query: string;
  result: SolveResult;
  timestamp: number;
}
