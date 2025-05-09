export const gravity = 0.5;
export const jump = -7;

export const updateBirdPosition = (birdY: number, velocity: number, canvasHeight: number, birdHeight: number) => {
  velocity += gravity;
  birdY += velocity;

  if (birdY + birdHeight > canvasHeight) {
    birdY = canvasHeight - birdHeight;
    velocity = 0;
  }

  if (birdY < 0) {
    birdY = 0;
    velocity = 0;
  }

  return { birdY, velocity };
};
