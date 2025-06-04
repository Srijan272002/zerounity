import { CodeTemplate, CodeGenerationRequest, GeneratedCode } from '../../types/code-synthesis';
import { CodeValidator } from './CodeValidator';

export class GodotGenerator {
  private templates: Map<string, CodeTemplate>;
  private validator: CodeValidator;

  constructor() {
    this.templates = new Map();
    this.validator = new CodeValidator();
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Basic Node template
    this.addTemplate({
      id: 'basic_node',
      engine: 'godot',
      language: 'gdscript',
      category: 'node',
      name: 'Basic Node',
      description: 'Basic Godot node script template',
      code: `extends {{baseClass}}

{{signals}}

{{variables}}

# Called when the node enters the scene tree for the first time.
func _ready():
    {{readyContent}}

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
    {{processContent}}`,
      parameters: [
        {
          name: 'baseClass',
          type: 'string',
          description: 'Base class to extend from',
          required: true,
          defaultValue: 'Node'
        },
        {
          name: 'signals',
          type: 'string',
          description: 'Signal declarations',
          required: false,
          defaultValue: '# Define signals here'
        },
        {
          name: 'variables',
          type: 'string',
          description: 'Variable declarations',
          required: false,
          defaultValue: '# Define variables here'
        },
        {
          name: 'readyContent',
          type: 'string',
          description: 'Code to run in _ready',
          required: false,
          defaultValue: 'pass # Replace with function body'
        },
        {
          name: 'processContent',
          type: 'string',
          description: 'Code to run in _process',
          required: false,
          defaultValue: 'pass # Replace with function body'
        }
      ]
    });

    // Resource template
    this.addTemplate({
      id: 'custom_resource',
      engine: 'godot',
      language: 'gdscript',
      category: 'resource',
      name: 'Custom Resource',
      description: 'Template for creating custom Godot resources',
      code: `extends Resource
class_name {{className}}

{{properties}}

func _init({{initParams}}):
    {{initContent}}`,
      parameters: [
        {
          name: 'className',
          type: 'string',
          description: 'Name of the resource class',
          required: true
        },
        {
          name: 'properties',
          type: 'string',
          description: 'Property declarations',
          required: false,
          defaultValue: '# Define properties here'
        },
        {
          name: 'initParams',
          type: 'string',
          description: 'Constructor parameters',
          required: false,
          defaultValue: ''
        },
        {
          name: 'initContent',
          type: 'string',
          description: 'Constructor initialization code',
          required: false,
          defaultValue: 'pass # Replace with initialization code'
        }
      ]
    });

    // State Machine template
    this.addTemplate({
      id: 'state_machine',
      engine: 'godot',
      language: 'gdscript',
      category: 'pattern',
      name: 'State Machine',
      description: 'Template for creating a state machine pattern',
      code: `extends Node
class_name {{className}}

var current_state = null
var states = {}

func _ready():
    {{initStates}}
    
    if states.size() > 0:
        current_state = states.values()[0]
        current_state.enter()

func _process(delta):
    if current_state != null:
        current_state.update(delta)

func add_state(state_name: String, state_node: Node) -> void:
    states[state_name] = state_node

func change_state(new_state: String) -> void:
    if current_state != null:
        current_state.exit()
    
    if states.has(new_state):
        current_state = states[new_state]
        current_state.enter()`,
      parameters: [
        {
          name: 'className',
          type: 'string',
          description: 'Name of the state machine class',
          required: true
        },
        {
          name: 'initStates',
          type: 'string',
          description: 'State initialization code',
          required: false,
          defaultValue: '# Initialize your states here'
        }
      ]
    });
  }

  public generateCode(request: CodeGenerationRequest): GeneratedCode {
    const template = this.findTemplate(request.category);
    if (!template) {
      throw new Error(`No template found for category: ${request.category}`);
    }

    let code = template.code;
    
    // Replace template parameters
    for (const param of template.parameters) {
      const value = request.parameters[param.name] || param.defaultValue;
      if (param.required && !value) {
        throw new Error(`Missing required parameter: ${param.name}`);
      }
      code = code.replace(new RegExp(`{{${param.name}}}`, 'g'), value || '');
    }

    // Apply any custom modifications
    if (request.customization) {
      code = this.applyCustomization(code, request.customization);
    }

    // Validate the generated code
    const validation = this.validator.validateCode({
      engine: 'godot',
      language: 'gdscript',
      code
    });

    return {
      engine: 'godot',
      language: 'gdscript',
      filename: `${request.parameters.className || 'generated_script'}.gd`,
      code,
      validation,
      metadata: {
        generatedAt: new Date().toISOString(),
        templateId: template.id,
        category: template.category,
        parameters: request.parameters
      }
    };
  }

  private findTemplate(category: string): CodeTemplate | undefined {
    return Array.from(this.templates.values()).find(t => t.category === category);
  }

  private applyCustomization(code: string, customization: Record<string, any>): string {
    // Apply any custom modifications to the code
    if (customization.tool) {
      code = '@tool\n' + code;
    }

    if (customization.iconPath) {
      code = `@icon("${customization.iconPath}")\n` + code;
    }

    return code;
  }

  public addTemplate(template: CodeTemplate): void {
    this.templates.set(template.id, template);
  }

  public getTemplate(id: string): CodeTemplate | undefined {
    return this.templates.get(id);
  }

  public getAllTemplates(): CodeTemplate[] {
    return Array.from(this.templates.values());
  }
} 