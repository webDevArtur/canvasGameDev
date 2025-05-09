import { Pipe } from '../types';

export const generatePipe = (canvasHeight: number, canvasWidth: number, pipeGap: number): Pipe => {
  const maxTopHeight = canvasHeight - pipeGap;
  const pipeHeight = Math.floor(Math.random() * maxTopHeight);

  return {
    x: canvasWidth,
    topHeight: pipeHeight,
    bottomHeight: canvasHeight - pipeHeight - pipeGap,
    passed: false,
  };
};

export const updatePipes = (
    pipes: Pipe[],
    birdX: number,
    pipeWidth: number,
    pipeSpeed: number,
    canvasWidth: number,
    minPipeDistance: number,
    generatePipe: (canvasHeight: number, canvasWidth: number, pipeGap: number) => Pipe, // СНАЧАЛА функция
    canvasHeight: number,
    pipeGap: number
  ) => {
  let scoreIncrement = 0;

  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    if (!pipe.passed && pipe.x + pipeWidth < birdX) {
      pipe.passed = true;
      scoreIncrement++;
    }

    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
    }
  });

  const lastPipe = pipes[pipes.length - 1];
  if (!lastPipe || (canvasWidth - lastPipe.x) > minPipeDistance) {
    if (Math.random() < 0.02) {
      pipes.push(generatePipe(canvasHeight, canvasWidth, pipeGap));
    }
  }

  return scoreIncrement;
};
