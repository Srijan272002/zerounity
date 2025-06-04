export type GameEngine = 'unity' | 'godot';
export type CodeLanguage = 'csharp' | 'gdscript';

export interface CodeTemplate {
  id: string;
  engine: GameEngine;
  language: CodeLanguage;
  category: string;
  name: string;
  description: string;
  code: string;
  parameters: TemplateParameter[];
}

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface CodeGenerationRequest {
  engine: GameEngine;
  category: string;
  parameters: Record<string, any>;
  customization?: Record<string, any>;
}

export interface ValidationRule {
  id: string;
  engine: GameEngine;
  language: CodeLanguage;
  name: string;
  description: string;
  validator: string; // Regex or custom validation logic
  severity: 'error' | 'warning' | 'info';
  category: 'syntax' | 'style' | 'performance' | 'security' | 'best-practice';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  rule: string;
  message: string;
  line: number;
  column: number;
  severity: 'error';
  code: string;
}

export interface ValidationWarning {
  rule: string;
  message: string;
  line: number;
  column: number;
  severity: 'warning';
  suggestion?: string;
}

export interface ValidationSuggestion {
  rule: string;
  message: string;
  line: number;
  column: number;
  severity: 'info';
  improvement: string;
}

export interface GeneratedCode {
  engine: GameEngine;
  language: CodeLanguage;
  filename: string;
  code: string;
  validation: ValidationResult;
  metadata: {
    generatedAt: string;
    templateId: string;
    category: string;
    parameters: Record<string, any>;
  };
} 