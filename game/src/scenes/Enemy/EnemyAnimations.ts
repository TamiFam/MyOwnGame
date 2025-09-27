export function createEnemyAnimations(scene: Phaser.Scene) {

  // Враг воин
    scene.anims.create({
      key: 'warrior_walk_down',
      frames: scene.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1
    });
  
    scene.anims.create({
      key: 'warrior_walk_left',
      frames: scene.anims.generateFrameNumbers('enemy', { start: 6, end: 11 }),
      frameRate: 6,
      repeat: -1
    });
  
    scene.anims.create({
      key: 'warrior_walk_right',
      frames: scene.anims.generateFrameNumbers('enemy', { start: 12, end: 17 }),
      frameRate: 6,
      repeat: -1
    });
  
    scene.anims.create({
      key: 'warrior_walk_up',
      frames: scene.anims.generateFrameNumbers('enemy', { start: 18, end: 22 }),
      frameRate: 6,
      repeat: -1
      
    });
    scene.anims.create({
        key: 'warrior_attack_up',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 54, end: 59 }),
        frameRate: 6,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'warrior_attack_down',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 48, end:53 }),
        frameRate: 6,
        repeat: 0   
        
      });
      scene.anims.create({
        key: 'warrior_attack_left',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 60, end: 65 }),
        frameRate: 6,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'warrior_attack_right',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 66, end: 71 }),
        frameRate: 6,
        repeat: 0
        
      });

      //Враг скелетон
      scene.anims.create({
        key: 'skeleton-idle',
        frames: scene.anims.generateFrameNumbers('enemy-skeleton', { start: 1, end: 15  }),
        frameRate: 5,
        repeat: -1
        
      });
      scene.anims.create({
        key: 'skeleton_walk',
        frames: scene.anims.generateFrameNumbers('enemy-skeleton-walk', { start: 0, end: 10  }),
        frameRate: 12,
        repeat: -1
        
      });
      scene.anims.create({
        key: 'skeleton_attack',
        frames: scene.anims.generateFrameNumbers('enemy-skeleton-attack', { start: 0, end: 25  }),
        frameRate: 30,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'skeleton_projectile',
        frames: scene.anims.generateFrameNumbers('enemy-skeleton-hit-effect', { start: 0, end: 25  }),
        frameRate: 30,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'skeleton_death',
        frames: scene.anims.generateFrameNumbers('enemy-skeleton-death', { start: 0, end: 51  }),
        frameRate: 30,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'skeleton_idle',
        frames: scene.anims.generateFrameNumbers('enemy-skeleton-idle', { start: 0, end: 45  }),
        frameRate: 30,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'gorgona_idle',
        frames: scene.anims.generateFrameNumbers('enemy-gorgona-idle', { start: 0, end: 6  }),
        frameRate: 30,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'gorgona_walk',
        frames: scene.anims.generateFrameNumbers('enemy-gorgona-walk', { start: 0, end: 12  }),
        frameRate: 20,
        repeat: -1
        
      });
      scene.anims.create({
        key: 'gorgona_attack1',
        frames: scene.anims.generateFrameNumbers('enemy-gorgona-attack', { start: 0, end: 16  }),
        frameRate: 13,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'gorgona_attack2',
        frames: scene.anims.generateFrameNumbers('enemy-gorgona-attack2', { start: 0, end: 7  }),
        frameRate: 10,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'gorgona_attack3',
        frames: scene.anims.generateFrameNumbers('enemy-gorgona-attack3', { start: 0, end: 9  }),
        frameRate: 10,
        repeat: 0
        
      });
      scene.anims.create({
        key: 'gorgona_dead',
        frames: scene.anims.generateFrameNumbers('enemy-gorgona-dead', { start: 0, end: 3  }),
        frameRate: 5,
        repeat: 0
        
      });
      // scene.anims.create({
      //   key: 'skeleton_attack_down',
      //   frames: scene.anims.generateFrameNumbers('enemy-skeleton-attack', { start: 0, end: 25  }),
      //   frameRate: 6,
      //   repeat: 0
        
      // });
      // scene.anims.create({
      //   key: 'skeleton_attack_left',
      //   frames: scene.anims.generateFrameNumbers('enemy-skeleton-attack', { start: 0, end: 25  }),
      //   frameRate: 6,
      //   repeat: 0
        
      // });
      // scene.anims.create({
      //   key: 'skeleton_attack_right',
      //   frames: scene.anims.generateFrameNumbers('enemy-skeleton-attack', { start: 0, end: 25  }),
      //   frameRate: 6,
      //   repeat: 0
        
      // });
    
    
  }
  