export interface Questionnaire {
  id: string;
  name?: string;
  category?: string;
  questions?: Question[];
}

export interface Question {
  id?: string;
  text?: string;
  metric?: string;
  category?: string;
  answer?: string | object;
  metric_values?: {
    val: string;
  }[];
  required?: boolean;
  completed?: boolean;
  validators?: {
    min?: number;
    max?: number;
  };
}

export interface ChatBot {
  id: string;
  content: string;
  responseType?: string;
  responseOptions?: {
    val: string;
  }[];
  dimension?: string;
  answer?: string[];
  required?: boolean;
  completed?: boolean;
  validators?: {
    min?: number;
    max?: number;
  };
}
export interface Interaction {
  name: string;
  dimension: string;
  personaId: string;
  usecaseId: string;
  questions: ChatBot[];
}
