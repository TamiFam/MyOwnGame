 export class Health {
    private currentHealth: number;
    private deathCallback?: () => void;
    private  maxHealth: number;
   

    private static  MAX_HEALTH_BY_TYPE: Record<string,number> = {
      warrior: 100,
      skeleton:50,
      gorgona: 600
    
    }

    constructor(entityType: string) {
      this.maxHealth = Health.MAX_HEALTH_BY_TYPE[entityType] ?? 150;
      this.currentHealth = this.maxHealth;
      
    }
  
    takeDamage(amount: number) {
      this.currentHealth = Math.max(0, this.currentHealth - amount);
      if (this.currentHealth === 0 && this.deathCallback) {
        this.deathCallback();
      }
    }
  
    isAlive() {
      return this.currentHealth > 0;
    }
    getHeroMaxHealth() {
      return this.maxHealth
    }
    getHealthByType(healthType: string) {
      return Health.MAX_HEALTH_BY_TYPE[healthType]
    }
  
    getCurrentHealth() {
      return this.currentHealth;
    }
    increaseCurrentHealthLevel(playerLevel:number) {
     this.maxHealth += Math.floor((25 * playerLevel) /3)

    }
    increaseCurrentHealthSkill(amount: number) {
      if (amount <= 0) return this.currentHealth;
    
      this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);
      return this.currentHealth;
    }
    upgradeHealthSkill(){
      this.maxHealth += 100
      // this.currentHealth = this.maxHealth
      
    }
  
    onDeath(callback: () =>  void){
        this.deathCallback = callback;
    } 
  }
  