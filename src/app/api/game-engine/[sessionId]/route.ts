import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params.sessionId;

  try {
    // Fetch the game data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/games/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load game data');
    }
    
    const gameData = await response.json();

    // Generate the game HTML with proper initialization
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Game</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: #000;
            }
            #game-container {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            canvas {
              max-width: 100%;
              max-height: 100%;
              background: #1a1625;
            }
            #loading {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .error {
              color: #ff4444;
            }
          </style>
        </head>
        <body>
          <div id="game-container">
            <canvas id="game-canvas"></canvas>
            <div id="loading">Loading game assets...</div>
          </div>
          <script>
            // Initialize canvas with proper dimensions
            const canvas = document.getElementById('game-canvas');
            const ctx = canvas.getContext('2d');
            const loading = document.getElementById('loading');
            canvas.width = 800;
            canvas.height = 600;

            // Load game assets
            const assets = ${JSON.stringify(gameData.assets)};
            const loadedAssets = {};
            let loadingErrors = false;

            // Asset loading promise with retries
            const loadAsset = (asset, retries = 3) => {
              return new Promise((resolve, reject) => {
                const img = new Image();
                
                img.onload = () => {
                  loadedAssets[asset.id] = img;
                  resolve();
                };
                
                img.onerror = () => {
                  if (retries > 0) {
                    console.log(\`Retrying to load \${asset.id}, attempts left: \${retries - 1}\`);
                    setTimeout(() => {
                      loadAsset(asset, retries - 1).then(resolve).catch(reject);
                    }, 1000);
                  } else {
                    loadingErrors = true;
                    loading.innerHTML = \`Error loading asset: \${asset.id}<br>Please refresh the page to try again.\`;
                    loading.classList.add('error');
                    reject(new Error(\`Failed to load asset: \${asset.id}\`));
                  }
                };
                
                img.crossOrigin = 'anonymous';
                img.src = asset.path;
              });
            };

            // Load all assets with retries
            Promise.all(assets.map(asset => 
              asset.type === 'sprite' ? loadAsset(asset) : Promise.resolve()
            ))
            .then(() => {
              if (!loadingErrors) {
                loading.style.display = 'none';
                
                // Game code
                ${gameData.code}

                // Initialize game with canvas context and assets
                const game = new TimeGame(ctx, loadedAssets);
                
                // Game loop with proper timing
                let lastTime = 0;
                function gameLoop(timestamp) {
                  const deltaTime = timestamp - lastTime;
                  lastTime = timestamp;
                  
                  // Update and render game
                  game.update(deltaTime / 1000); // Convert to seconds
                  
                  requestAnimationFrame(gameLoop);
                }
                
                requestAnimationFrame(gameLoop);
              }
            })
            .catch(error => {
              console.error('Failed to load game assets:', error);
              loading.innerHTML = 'Failed to load game assets.<br>Please refresh the page to try again.';
              loading.classList.add('error');
            });
          </script>
        </body>
      </html>
    `;

    // Return the HTML with proper headers
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving game:', error);
    return NextResponse.json(
      { error: 'Failed to load game' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 