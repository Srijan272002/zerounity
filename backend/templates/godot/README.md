# Godot Integration System

This system provides integration between the backend server and Godot projects. It supports:
- Project template management
- GDScript code injection
- Scene generation

## API Endpoints

### Create Project
```http
POST /api/godot/project
{
    "projectName": "MyGame",
    "templateName": "basic"
}
```

### Inject GDScript
```http
POST /api/godot/inject
{
    "projectName": "MyGame",
    "targetScript": "game_manager.gd",
    "codeToInject": "var speed = 5.0",
    "injectionPoint": "# INJECTION_POINT: Variables"
}
```

### Generate Scene
```http
POST /api/godot/scene
{
    "projectName": "MyGame",
    "sceneName": "level_1",
    "sceneConfig": {
        "nodes": [
            {
                "name": "Level1",
                "type": "Node2D",
                "children": [
                    {
                        "name": "Player",
                        "type": "CharacterBody2D",
                        "properties": {
                            "position": "Vector2(100, 100)"
                        }
                    }
                ]
            }
        ]
    }
}
```

## Project Templates

### Basic Template
The basic template includes:
- Project configuration (project.godot)
- Basic folder structure
- GameManager script with injection points
- Main scene template

### Injection Points in game_manager.gd
- Variables
- Ready
- Process
- Input
- Methods

## Usage Example
1. Create a new project using the basic template
2. Inject custom GDScript code into the game_manager script
3. Generate scenes with custom configurations

## Notes
- All projects are created in the `projects/godot` directory
- Templates are stored in `templates/godot`
- Scene files use the `.tscn` extension
- GDScript files use the `.gd` extension 