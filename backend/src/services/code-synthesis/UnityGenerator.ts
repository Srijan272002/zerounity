import { CodeTemplate, CodeGenerationRequest, GeneratedCode } from '../../types/code-synthesis';
import { CodeValidator } from './CodeValidator';

export class UnityGenerator {
  private templates: Map<string, CodeTemplate>;
  private validator: CodeValidator;

  constructor() {
    this.templates = new Map();
    this.validator = new CodeValidator();
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Basic MonoBehaviour template
    this.addTemplate({
      id: 'basic_monobehaviour',
      engine: 'unity',
      language: 'csharp',
      category: 'component',
      name: 'Basic MonoBehaviour',
      description: 'Basic Unity MonoBehaviour script template',
      code: `using UnityEngine;

public class {{className}} : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        {{startContent}}
    }

    // Update is called once per frame
    void Update()
    {
        {{updateContent}}
    }
}`,
      parameters: [
        {
          name: 'className',
          type: 'string',
          description: 'Name of the component class',
          required: true
        },
        {
          name: 'startContent',
          type: 'string',
          description: 'Code to run in Start method',
          required: false,
          defaultValue: '// Initialize your component here'
        },
        {
          name: 'updateContent',
          type: 'string',
          description: 'Code to run in Update method',
          required: false,
          defaultValue: '// Update logic goes here'
        }
      ]
    });

    // ScriptableObject template
    this.addTemplate({
      id: 'scriptable_object',
      engine: 'unity',
      language: 'csharp',
      category: 'data',
      name: 'ScriptableObject',
      description: 'Template for creating ScriptableObject data containers',
      code: `using UnityEngine;

[CreateAssetMenu(fileName = "{{fileName}}", menuName = "{{menuPath}}")]
public class {{className}} : ScriptableObject
{
    {{properties}}
}`,
      parameters: [
        {
          name: 'className',
          type: 'string',
          description: 'Name of the ScriptableObject class',
          required: true
        },
        {
          name: 'fileName',
          type: 'string',
          description: 'Default file name for the asset',
          required: true
        },
        {
          name: 'menuPath',
          type: 'string',
          description: 'Asset menu path',
          required: true
        },
        {
          name: 'properties',
          type: 'string',
          description: 'Property definitions',
          required: false,
          defaultValue: '// Add your properties here'
        }
      ]
    });

    // Custom Editor template
    this.addTemplate({
      id: 'custom_editor',
      engine: 'unity',
      language: 'csharp',
      category: 'editor',
      name: 'Custom Editor',
      description: 'Template for creating custom Unity editors',
      code: `using UnityEngine;
using UnityEditor;

[CustomEditor(typeof({{targetClass}}))]
public class {{className}} : Editor
{
    public override void OnInspectorGUI()
    {
        {{targetClass}} target = ({{targetClass}})target;
        
        EditorGUI.BeginChangeCheck();
        
        {{inspectorContent}}
        
        if (EditorGUI.EndChangeCheck())
        {
            serializedObject.ApplyModifiedProperties();
        }
    }
}`,
      parameters: [
        {
          name: 'className',
          type: 'string',
          description: 'Name of the editor class',
          required: true
        },
        {
          name: 'targetClass',
          type: 'string',
          description: 'Name of the class being edited',
          required: true
        },
        {
          name: 'inspectorContent',
          type: 'string',
          description: 'Custom inspector GUI code',
          required: false,
          defaultValue: '// Add your custom inspector GUI here'
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
      engine: 'unity',
      language: 'csharp',
      code
    });

    return {
      engine: 'unity',
      language: 'csharp',
      filename: `${request.parameters.className || 'GeneratedScript'}.cs`,
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
    if (customization.namespace) {
      code = `namespace ${customization.namespace}\n{\n${code}\n}`;
    }

    if (customization.using) {
      const usings = Array.isArray(customization.using) ? customization.using : [customization.using];
      code = usings.map(u => `using ${u};\n`).join('') + '\n' + code;
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