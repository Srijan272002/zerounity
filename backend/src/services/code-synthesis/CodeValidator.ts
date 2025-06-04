import { ValidationRule, ValidationResult, ValidationError, ValidationWarning, ValidationSuggestion } from '../../types/code-synthesis';

export class CodeValidator {
  private rules: Map<string, ValidationRule>;

  constructor() {
    this.rules = new Map();
    this.initializeRules();
  }

  private initializeRules(): void {
    // Unity C# rules
    this.addRule({
      id: 'unity_namespace',
      engine: 'unity',
      language: 'csharp',
      name: 'Unity Namespace',
      description: 'Check if Unity namespace is imported',
      validator: '^using\\s+UnityEngine;',
      severity: 'error',
      category: 'syntax'
    });

    this.addRule({
      id: 'unity_class_inheritance',
      engine: 'unity',
      language: 'csharp',
      name: 'Unity Class Inheritance',
      description: 'Check if class inherits from Unity base class',
      validator: 'class\\s+\\w+\\s*:\\s*(MonoBehaviour|ScriptableObject|Editor)',
      severity: 'error',
      category: 'syntax'
    });

    this.addRule({
      id: 'unity_method_naming',
      engine: 'unity',
      language: 'csharp',
      name: 'Unity Method Naming',
      description: 'Check Unity method naming conventions',
      validator: '(Start|Update|Awake|FixedUpdate|LateUpdate|OnEnable|OnDisable)\\s*\\(',
      severity: 'warning',
      category: 'style'
    });

    // Godot GDScript rules
    this.addRule({
      id: 'godot_extends',
      engine: 'godot',
      language: 'gdscript',
      name: 'Godot Extends',
      description: 'Check if script extends from a base class',
      validator: '^extends\\s+\\w+',
      severity: 'error',
      category: 'syntax'
    });

    this.addRule({
      id: 'godot_method_naming',
      engine: 'godot',
      language: 'gdscript',
      name: 'Godot Method Naming',
      description: 'Check Godot method naming conventions',
      validator: '(_ready|_process|_physics_process|_input|_unhandled_input)\\s*\\(',
      severity: 'warning',
      category: 'style'
    });

    this.addRule({
      id: 'godot_signal_declaration',
      engine: 'godot',
      language: 'gdscript',
      name: 'Godot Signal Declaration',
      description: 'Check signal declaration syntax',
      validator: 'signal\\s+\\w+',
      severity: 'error',
      category: 'syntax'
    });
  }

  public validateCode(params: {
    engine: 'unity' | 'godot';
    language: 'csharp' | 'gdscript';
    code: string;
  }): ValidationResult {
    const { engine, language, code } = params;
    const lines = code.split('\n');
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // Get relevant rules for the engine and language
    const relevantRules = Array.from(this.rules.values()).filter(
      rule => rule.engine === engine && rule.language === language
    );

    // Check each line against the rules
    lines.forEach((line, index) => {
      relevantRules.forEach(rule => {
        const regex = new RegExp(rule.validator);
        const lineNumber = index + 1;

        if (!regex.test(line)) {
          switch (rule.severity) {
            case 'error':
              errors.push({
                rule: rule.id,
                message: rule.description,
                line: lineNumber,
                column: 1,
                severity: 'error',
                code: line
              });
              break;
            case 'warning':
              warnings.push({
                rule: rule.id,
                message: rule.description,
                line: lineNumber,
                column: 1,
                severity: 'warning',
                suggestion: this.getSuggestion(rule, line)
              });
              break;
            case 'info':
              suggestions.push({
                rule: rule.id,
                message: rule.description,
                line: lineNumber,
                column: 1,
                severity: 'info',
                improvement: this.getSuggestion(rule, line)
              });
              break;
          }
        }
      });
    });

    // Additional engine-specific validations
    if (engine === 'unity') {
      this.validateUnitySpecifics(code, errors, warnings, suggestions);
    } else if (engine === 'godot') {
      this.validateGodotSpecifics(code, errors, warnings, suggestions);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateUnitySpecifics(
    code: string,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for common Unity-specific issues
    if (!code.includes('void Start()') && !code.includes('void Awake()')) {
      suggestions.push({
        rule: 'unity_lifecycle',
        message: 'Consider implementing Start or Awake for initialization',
        line: 1,
        column: 1,
        severity: 'info',
        improvement: 'Add void Start() or void Awake() method for initialization logic'
      });
    }

    // Check for potential memory leaks
    if (code.includes('GetComponent') && !code.includes('void OnDestroy()')) {
      warnings.push({
        rule: 'unity_cleanup',
        message: 'GetComponent usage detected without cleanup',
        line: 1,
        column: 1,
        severity: 'warning',
        suggestion: 'Consider implementing OnDestroy to clean up references'
      });
    }
  }

  private validateGodotSpecifics(
    code: string,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for common Godot-specific issues
    if (!code.includes('func _ready()')) {
      suggestions.push({
        rule: 'godot_lifecycle',
        message: 'Consider implementing _ready for initialization',
        line: 1,
        column: 1,
        severity: 'info',
        improvement: 'Add func _ready() for initialization logic'
      });
    }

    // Check for proper signal connections
    if (code.includes('connect(') && !code.includes('func _exit_tree()')) {
      warnings.push({
        rule: 'godot_cleanup',
        message: 'Signal connection detected without cleanup',
        line: 1,
        column: 1,
        severity: 'warning',
        suggestion: 'Consider implementing _exit_tree to disconnect signals'
      });
    }
  }

  private getSuggestion(rule: ValidationRule, line: string): string {
    // Generate context-aware suggestions based on the rule and the line content
    switch (rule.id) {
      case 'unity_method_naming':
        return 'Use PascalCase for method names and ensure they follow Unity lifecycle naming conventions';
      case 'godot_method_naming':
        return 'Use snake_case for method names and ensure they follow Godot naming conventions';
      default:
        return `Consider following the ${rule.category} guidelines`;
    }
  }

  public addRule(rule: ValidationRule): void {
    this.rules.set(rule.id, rule);
  }

  public getRule(id: string): ValidationRule | undefined {
    return this.rules.get(id);
  }

  public getAllRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }
} 