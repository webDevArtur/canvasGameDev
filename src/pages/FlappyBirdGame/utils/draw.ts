import { Pipe } from '../types';

export const drawPipes = (
  ctx: CanvasRenderingContext2D,
  pipes: Pipe[],
  pipeImg: HTMLImageElement,
  canvasHeight: number,
  pipeWidth: number
) => {
  pipes.forEach((pipe) => {
    ctx.drawImage(pipeImg, pipe.x, canvasHeight - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);

    ctx.save();
    ctx.translate(pipe.x + pipeWidth / 2, pipe.topHeight);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, -pipeWidth / 2, 0, pipeWidth, pipe.topHeight);
    ctx.restore();
  });
};

export const drawBird = (
  ctx: CanvasRenderingContext2D,
  birdImg: HTMLImageElement,
  birdX: number,
  birdY: number,
  birdWidth: number,
  birdHeight: number
) => {
  ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
};

export const drawScore = (ctx: CanvasRenderingContext2D, score: number) => {
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('Счёт: ' + score, 20, 40);
};

export const drawPauseMenu = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Нажми Space для продолжения', canvasWidth / 2, canvasHeight / 2);
  ctx.restore();
};

export const drawGameOverMenu = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Игра окончена. Нажми Space для перезапуска', canvasWidth / 2, canvasHeight / 2);
  ctx.restore();
};
