import express from 'express';

const router = express.Router();

router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // TODO: Replace with actual database query
    // For now, return sample data
    const gameData = {
      code: `// Generated game code
class TimeGame {
  constructor(ctx, assets) {
    this.ctx = ctx;
    this.assets = assets;
    this.player = new Player(this.ctx, this.assets.player);
    this.timeObjects = [];
    this.currentPeriod = "present";
  }

  update(deltaTime) {
    this.player.update(deltaTime);
    this.timeObjects.forEach(obj => obj.update(this.currentPeriod, deltaTime));
    this.render();
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    // Draw the player
    this.player.render();
    
    // Draw time objects
    this.timeObjects.forEach(obj => obj.render());
  }

  switchTimePeriod(period) {
    this.currentPeriod = period;
    // Update game state based on time period
  }
}

class Player {
  constructor(ctx, sprite) {
    this.ctx = ctx;
    this.sprite = sprite;
    this.position = { x: 400, y: 300 };
    this.speed = 5;
    this.width = 32;
    this.height = 32;
  }

  update(deltaTime) {
    // Handle player movement based on keyboard input
    const keys = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft': keys.left = true; break;
        case 'ArrowRight': keys.right = true; break;
        case 'ArrowUp': keys.up = true; break;
        case 'ArrowDown': keys.down = true; break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch(e.key) {
        case 'ArrowLeft': keys.left = false; break;
        case 'ArrowRight': keys.right = false; break;
        case 'ArrowUp': keys.up = false; break;
        case 'ArrowDown': keys.down = false; break;
      }
    });

    if (keys.left) this.position.x -= this.speed * deltaTime;
    if (keys.right) this.position.x += this.speed * deltaTime;
    if (keys.up) this.position.y -= this.speed * deltaTime;
    if (keys.down) this.position.y += this.speed * deltaTime;
  }

  render() {
    // Draw the player sprite
    this.ctx.drawImage(
      this.sprite,
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height
    );
  }
}`,
      assets: [
        {
          id: 'player',
          type: 'sprite',
          path: 'http://localhost:3001/assets/player.png',
          metadata: {
            width: 32,
            height: 32,
            format: 'png',
            size: 2048,
            createdAt: new Date().toISOString(),
            optimized: true,
            tags: ['player', 'character']
          }
        }
      ],
      preview: {
        interactiveUrl: `/game/play?session=${sessionId}`
      }
    };

    res.json(gameData);
  } catch (error) {
    console.error('Error retrieving game data:', error);
    res.status(500).json({ error: 'Failed to retrieve game data' });
  }
});

export default router; 