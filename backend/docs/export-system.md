# Export System

The Export System provides functionality for generating ZIP files, bundling assets, managing downloads, and validating exports.

## Features

### ZIP File Generation
- Create ZIP archives from source directories
- Automatic validation of generated ZIP files
- Support for custom output paths

### Asset Bundling
- Bundle multiple assets into a single package
- Automatic metadata generation
- Asset integrity verification
- Support for various asset types

### Download Management
- Secure download URL generation
- Export validation before download
- Support for large file downloads

### Export Validation
- ZIP file integrity checking
- Asset bundle manifest validation
- Hash-based integrity verification
- Size and metadata validation

## API Endpoints

### Generate ZIP
```http
POST /api/export/zip
{
    "sourcePath": "/path/to/source",
    "outputName": "my-export"
}
```

### Bundle Assets
```http
POST /api/export/bundle
{
    "assets": [
        "/path/to/asset1",
        "/path/to/asset2"
    ],
    "bundleName": "my-bundle"
}
```

### Get Download URL
```http
GET /api/export/download/:exportId
```

### Validate Export
```http
POST /api/export/validate
{
    "exportPath": "/path/to/export.zip"
}
```

## Asset Bundle Format

Asset bundles are ZIP files with the `.bundle` extension containing:
- Original assets
- `manifest.json` with metadata:
  ```json
  {
    "id": "unique-bundle-id",
    "timestamp": "2024-03-21T12:00:00Z",
    "assets": [
      {
        "filename": "asset1.png",
        "hash": "sha256-hash",
        "size": 1024,
        "type": "png"
      }
    ],
    "totalSize": 1024,
    "version": "1.0"
  }
  ```

## Directory Structure
- `/exports` - Generated ZIP files and exports
- `/bundles` - Asset bundles
- `/temp` - Temporary files (automatically cleaned)

## Usage Examples

### Creating a Game Export
```typescript
// Generate ZIP from game files
const zipPath = await exportService.generateZip(
    'path/to/game',
    'exports/game-v1.zip'
);

// Validate the export
const isValid = await exportService.validateExport(zipPath);
```

### Bundling Game Assets
```typescript
// Bundle game assets
const bundlePath = await exportService.bundleAssets(
    [
        'assets/sprites/player.png',
        'assets/audio/background.mp3'
    ],
    'game-assets'
);

// Get download URL
const downloadUrl = await exportService.getDownloadUrl(bundlePath);
```

## Security Considerations
- All file paths are validated
- ZIP bombs are prevented through size checks
- Asset integrity is verified using SHA-256 hashes
- Temporary files are automatically cleaned up
- Download URLs can be secured with authentication 