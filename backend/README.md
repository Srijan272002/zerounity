# Game Development Backend Services

This backend system provides various services for game development, including code synthesis and asset generation.

## Asset Generator

The Asset Generator service provides functionality for generating and optimizing game assets such as sprites and backgrounds.

### Features

1. **Sprite Generation**
   - Generate game sprites with customizable dimensions
   - Support for different art styles and themes
   - Multiple output formats (PNG, JPG, WebP)
   - Tag-based organization

2. **Background Generation**
   - Create game backgrounds with parallax layers
   - Customizable dimensions and styles
   - Support for different themes
   - Multiple output formats

3. **Asset Optimization**
   - Image compression and optimization
   - Format conversion
   - Size constraints
   - Metadata management

### API Endpoints

#### Sprite Generation
```http
POST /api/assets/sprite
Content-Type: application/json

{
  "width": number,
  "height": number,
  "style": string,
  "theme": string,
  "format": "png" | "jpg" | "webp",
  "tags": string[]
}
```

#### Background Generation
```http
POST /api/assets/background
Content-Type: application/json

{
  "width": number,
  "height": number,
  "style": string,
  "theme": string,
  "format": "png" | "jpg" | "webp",
  "parallaxLayers": number,
  "tags": string[]
}
```

#### Asset Optimization
```http
POST /api/assets/optimize
Content-Type: application/json

{
  "asset": {
    "id": string,
    "type": "sprite" | "background",
    "path": string,
    "metadata": {
      "width": number,
      "height": number,
      "format": string,
      "size": number,
      "createdAt": string,
      "optimized": boolean,
      "tags": string[]
    }
  },
  "quality": number,
  "maxWidth": number,
  "maxHeight": number,
  "format": "png" | "jpg" | "webp",
  "compressionLevel": number,
  "retainMetadata": boolean
}
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create required directories:
```bash
mkdir -p assets/sprites assets/backgrounds assets/optimized
```

3. Start the server:
```bash
npm start
```

### Dependencies

- sharp: Image processing
- uuid: Unique ID generation
- express: Web framework
- cors: Cross-origin resource sharing

### Future Improvements

1. Integration with AI image generation services
2. Asset metadata storage in a database
3. Batch processing capabilities
4. Asset versioning and history
5. Advanced optimization techniques
6. Cloud storage integration 