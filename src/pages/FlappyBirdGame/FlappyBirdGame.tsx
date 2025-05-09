import React, { useEffect, useRef, useState } from 'react';
import {
  drawBird,
  drawPipes,
  drawScore,
  drawPauseMenu,
  drawGameOverMenu,
} from './utils/draw';
import { Pipe } from './types';
import { updateBirdPosition, jump } from './utils/physics';
import { generatePipe, updatePipes } from './utils/pipes';
import { useNavigate } from 'react-router-dom';

import birdImgSrc from '../../assets/bird.png';
import pipeImgSrc from '../../assets/pipe.png';
import styles from './FlappyBirdGame.module.scss';

export const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const isPausedRef = useRef(isPaused);
  const isGameOverRef = useRef(isGameOver);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const birdImg = new Image();
    birdImg.src = birdImgSrc;

    const pipeImg = new Image();
    pipeImg.src = pipeImgSrc;

    let pipes: Pipe[] = [];
    const birdWidth = 50;
    const birdHeight = 50;
    const pipeWidth = 80;
    const pipeGap = 300;
    let pipeSpeed = 5;
    const minPipeDistance = 200;
    let birdY = 250;
    const birdX = 100;
    let velocity = 0;
    let score = 0;
    let lastSpeedUpScore = 0;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const resetGame = () => {
      birdY = 250;
      velocity = 0;
      pipes = [];
      score = 0;
      pipeSpeed = 5;
      lastSpeedUpScore = 0;
      setIsGameOver(false);
      isGameOverRef.current = false;
      animationFrameId = requestAnimationFrame(loop);
    };

    const checkCollision = () => {
      for (const pipe of pipes) {
        const inXRange = birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth;
        const hitTop = birdY < pipe.topHeight;
        const hitBottom = birdY + birdHeight > canvas.height - pipe.bottomHeight;

        if (inXRange && (hitTop || hitBottom)) {
          setIsGameOver(true);
          isGameOverRef.current = true;
          return;
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPausedRef.current) {
        drawBird(ctx, birdImg, birdX, birdY, birdWidth, birdHeight);
        drawPipes(ctx, pipes, pipeImg, canvas.height, pipeWidth);
        drawScore(ctx, score);
        drawPauseMenu(ctx, canvas.width, canvas.height);
      } else if (isGameOverRef.current) {
        drawBird(ctx, birdImg, birdX, birdY, birdWidth, birdHeight);
        drawPipes(ctx, pipes, pipeImg, canvas.height, pipeWidth);
        drawScore(ctx, score);
        drawGameOverMenu(ctx, canvas.width, canvas.height);
        return;
      } else {
        ({ birdY, velocity } = updateBirdPosition(
          birdY,
          velocity,
          canvas.height,
          birdHeight
        ));

        const increment = updatePipes(
          pipes,
          birdX,
          pipeWidth,
          pipeSpeed,
          canvas.width,
          minPipeDistance,
          generatePipe,
          canvas.height,
          pipeGap
        );

        score += increment;

        if (score % 5 === 0 && score > lastSpeedUpScore) {
          pipeSpeed += 1;
          lastSpeedUpScore = score;
        }

        drawBird(ctx, birdImg, birdX, birdY, birdWidth, birdHeight);
        drawPipes(ctx, pipes, pipeImg, canvas.height, pipeWidth);
        drawScore(ctx, score);
        checkCollision();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (isGameOverRef.current) {
          resetGame();
        } else {
          velocity = jump;
          if (isPausedRef.current) {
            setIsPaused(false);
          }
        }
      }

      if (event.code === 'Escape') {
        if (!isGameOverRef.current) {
          setIsPaused((prev) => !prev);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {(isPaused || isGameOver) && (
        <div className={styles.pauseOverlay}>
          <button onClick={handleExit} className={styles.pauseButton}>
            Выход на главную
          </button>
        </div>
      )}
    </div>
  );
};
