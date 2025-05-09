export interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
  }
  
  export interface Paddle {
    x: number;
    y: number;
  }
  
  export interface Block {
    x: number;
    y: number;
    width: number;
    height: number;
    isDestroyed: boolean;
    color: string;
  }
  