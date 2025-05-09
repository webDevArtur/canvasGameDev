import React, { useRef, useEffect, useState } from 'react';
import styles from './SnakeGame.module.scss'
import { useNavigate } from 'react-router-dom';

const cellSize = 30;

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(200);

  const gridCols = Math.floor(windowSize.width / cellSize);
  const gridRows = Math.floor(windowSize.height / cellSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateFood = (snakeBody: { x: number; y: number }[]) => {
    const occupied = new Set(snakeBody.map(seg => `${seg.x}-${seg.y}`));
    const allPositions = [];

    for (let x = 0; x < gridCols; x++) {
      for (let y = 0; y < gridRows; y++) {
        const key = `${x}-${y}`;
        if (!occupied.has(key)) {
          allPositions.push({ x, y });
        }
      }
    }

    if (allPositions.length === 0) {
      setGameOver(true);
      return food;
    }

    return allPositions[Math.floor(Math.random() * allPositions.length)];
  };

  const moveSnake = () => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (
      head.x < 0 || head.x >= gridCols ||
      head.y < 0 || head.y >= gridRows ||
      newSnake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      const newFood = generateFood(newSnake);
      setFood(newFood);
      setScore(prev => prev + 1);
      setSpeed(prev => Math.max(50, prev - 10));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
      const segment = snake[i];
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;

      if (i === 0) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, cellSize, cellSize);

        ctx.fillStyle = 'white';

        let leftEyeX = x + cellSize / 4;
        let rightEyeX = x + 3 * cellSize / 4;
        let eyeY = y + cellSize / 4;

        if (direction === 'UP') {
          eyeY = y + cellSize / 4;
        } else if (direction === 'DOWN') {
          eyeY = y + 3 * cellSize / 4;
        } else if (direction === 'LEFT') {
          leftEyeX = x + cellSize / 4;
          rightEyeX = x + cellSize / 4 * 3;
          eyeY = y + cellSize / 2;
        } else if (direction === 'RIGHT') {
          leftEyeX = x + 3 * cellSize / 4;
          rightEyeX = x + cellSize / 4;
          eyeY = y + cellSize / 2;
        }

        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + cellSize / 2, y + cellSize);
        ctx.lineTo(x + cellSize / 2, y + cellSize + 6);
        ctx.stroke();

        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);
      } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, cellSize, cellSize);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Счёт: ${score}`, 10, 25);
    ctx.fillText(`Скорость: ${speed} мс`, 10, 50);

    if (gameOver || isPaused) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';

      if (gameOver) {
        ctx.fillText('Игра окончена. Нажмите Space для перезапуска.', canvas.width / 2, canvas.height / 2 + 10);
      } else if (isPaused) {
        ctx.fillText('Пауза. Нажмите Escape чтобы продолжить.', canvas.width / 2, canvas.height / 2 + 10);
      }

      ctx.textAlign = 'start';
    }
  };

  const restartGame = () => {
    const initialSnake = [{ x: 2, y: 2 }];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setFood(generateFood(initialSnake));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(200);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsPaused(prev => !prev);
      return;
    }

    if (e.key === ' ' && gameOver) {
      restartGame();
      return;
    }

    if (gameOver || isPaused) return;

    if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
    if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
    if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake();
    }, speed);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, isPaused, speed]);

  useEffect(() => {
    draw();
  }, [snake, food, gameOver, score, speed, isPaused]);

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
      />
      
    {(isPaused || gameOver) && (
        <div className={styles.pauseOverlay}>
            <button onClick={handleExit} className={styles.pauseButton}>
              Выход на главную
            </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
