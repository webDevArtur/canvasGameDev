import { Paddle, Ball, Block } from "../types";

export const drawBlocks = (ctx: CanvasRenderingContext2D, blocks: Block[]) => {
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
      }
    });
  };
  
  export const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle, paddleImg: HTMLImageElement, paddleWidth: number, paddleHeight: number) => {
    const { x, y } = paddle;
    ctx.drawImage(paddleImg, x, y, paddleWidth, paddleHeight);
  };
  
  export const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball, ballImg: HTMLImageElement, ballSize: number) => {
    const { x, y } = ball;
    ctx.drawImage(ballImg, x - ballSize, y - ballSize, ballSize * 2, ballSize * 2);
  };
  
  export const drawPauseMenu = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '40px Arial';
    ctx.fillText('Пауза. Нажми Space для продолжения', w / 2, h / 2);
    ctx.restore();
  };
  
  export const drawGameOverMenu = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Игра окончена. Нажми Space для новой игры', w / 2, h / 2);
    ctx.restore();
  };
  