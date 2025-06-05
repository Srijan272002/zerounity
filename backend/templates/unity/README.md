# Unity Integration System

This system provides integration between the backend server and Unity projects. It supports:
- Project template management
- Code injection
- Asset packaging

## API Endpoints

### Create Project
```http
POST /api/unity/project
{
    "projectName": "MyGame",
    "templateName": "basic"
}
```

### Inject Code
```http
POST /api/unity/inject
{
    "projectName": "MyGame",
    "targetScript": "GameManager.cs",
    "codeToInject": "private float speed = 5f;",
    "injectionPoint": "// INJECTION_POINT: Variables"
}
```

### Package Assets
```http
POST /api/unity/package
{
    "projectName": "MyGame",
    "outputPath": "output/assets.zip"
}
```

## Project Templates

### Basic Template
The basic template includes:
- Project settings
- Basic folder structure
- GameManager script with injection points

### Injection Points
Available injection points in GameManager.cs:
- Variables
- Awake
- Start
- Update
- Methods

## Usage Example
1. Create a new project using the basic template
2. Inject custom code into the GameManager script
3. Package the assets for distribution

## Notes
- All projects are created in the `projects/unity` directory
- Templates are stored in `templates/unity`
- Asset packages are created in the specified output directory 