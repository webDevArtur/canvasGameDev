import React, { useEffect, useRef, useState } from 'react';
import { calculateBlockPositions } from './utils/blocks';
import { drawBlocks, drawPaddle, drawBall, drawPauseMenu, drawGameOverMenu } from './utils/draw';
import paddleImgSrc from '../../assets/paddle.png';
import ballImgSrc from '../../assets/ball.png';
import { useNavigate } from 'react-router-dom';
import styles from './PongGame.module.scss';

const BreakoutGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

  const paddleImg = new Image();
  paddleImg.src = paddleImgSrc;

  const ballImg = new Image();
  ballImg.src = ballImgSrc;

  const ballSize = 20;
  const initialBallSpeed = 3;

  const [ball, setBall] = useState({ x: 250, y: 250, dx: initialBallSpeed, dy: -initialBallSpeed });
  const paddleWidth = 180;
  const paddleHeight = 30;
  const initialPaddleX = window.innerWidth / 2 - paddleWidth / 2;
  const initialPaddleY = window.innerHeight - paddleHeight - 10;

  const [paddle, setPaddle] = useState({ x: initialPaddleX, y: initialPaddleY });
  const [blocks, setBlocks] = useState(calculateBlockPositions());
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const ballRef = useRef(ball);
  const blocksRef = useRef(blocks);
  const paddleRef = useRef(paddle);

  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    paddleRef.current = paddle;
  }, [paddle]);

  const checkAllBlocksDestroyed = () => {
    return blocksRef.current.every((block) => block.isDestroyed);
  };

  const moveBall = () => {
    if (isPaused || isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let { x, y, dx, dy } = ballRef.current;

    x += dx;
    y += dy;

    if (y - ballSize < 0 || y + ballSize > canvas.height) dy = -dy;
    if (y + ballSize > canvas.height) {
      setIsGameOver(true);
      return;
    }
    if (x + ballSize > canvas.width || x - ballSize < 0) dx = -dx;

    if (
      y + ballSize >= paddleRef.current.y &&
      x >= paddleRef.current.x &&
      x <= paddleRef.current.x + paddleWidth
    ) {
      dy = -dy;
      dx = (x - (paddleRef.current.x + paddleWidth / 2)) / (paddleWidth / 2) * initialBallSpeed * 0.5;
    }

    let collisionDetected = false;
    const updatedBlocks = blocksRef.current.map((block) => {
      if (
        !collisionDetected &&
        !block.isDestroyed &&
        x + ballSize > block.x &&
        x - ballSize < block.x + block.width &&
        y + ballSize > block.y &&
        y - ballSize < block.y + block.height
      ) {
        collisionDetected = true;

        const overlapLeft = x + ballSize - block.x;
        const overlapRight = block.x + block.width - (x - ballSize);
        const overlapTop = y + ballSize - block.y;
        const overlapBottom = block.y + block.height - (y - ballSize);

        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) dx = -dx;
        else dy = -dy;

        return { ...block, isDestroyed: true };
      }
      return block;
    });

    setBlocks(updatedBlocks);

    if (checkAllBlocksDestroyed()) setIsGameOver(true);

    setBall({ x, y, dx, dy });
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (isPaused) {
      drawBlocks(ctx, blocksRef.current);
      drawPaddle(ctx, paddleRef.current, paddleImg, paddleWidth, paddleHeight);
      drawBall(ctx, ballRef.current, ballImg, ballSize);
      drawPauseMenu(ctx, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    if (isGameOver) {
      drawBlocks(ctx, blocksRef.current);
      drawPaddle(ctx, paddleRef.current, paddleImg, paddleWidth, paddleHeight);
      drawBall(ctx, ballRef.current, ballImg, ballSize);
      drawGameOverMenu(ctx, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    drawBlocks(ctx, blocksRef.current);
    drawPaddle(ctx, paddleRef.current, paddleImg, paddleWidth, paddleHeight);
    drawBall(ctx, ballRef.current, ballImg, ballSize);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const paddleSpeed = 8;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (event.key === 'ArrowLeft') {
      setPaddle((prev) => ({ ...prev, x: Math.max(prev.x - paddleSpeed, 0) }));
    } else if (event.key === 'ArrowRight') {
      setPaddle((prev) => ({ ...prev, x: Math.min(prev.x + paddleSpeed, canvas.width - paddleWidth) }));
    } else if (event.key === 'Escape') {
      if (!isGameOver) {
        setIsPaused((prev) => !prev);
      }
    } else if (event.key === ' ' && isPaused) {
      setIsPaused(false);
    } else if (event.key === ' ' && isGameOver) {
      setIsGameOver(false);
      setBall({ x: 250, y: 250, dx: initialBallSpeed, dy: -initialBallSpeed });
      setBlocks(calculateBlockPositions());
      setPaddle({ x: initialPaddleX, y: initialPaddleY });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      moveBall();
      draw(ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paddle, isPaused, isGameOver]);

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={styles.canvas}
      />
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

export default BreakoutGame;
