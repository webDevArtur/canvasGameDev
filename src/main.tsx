import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FlappyBirdGame } from './pages/FlappyBirdGame/FlappyBirdGame.tsx';
import HomePage from './pages/HomePage/HomePage.tsx'
import PongGame from './pages/PongGame/PongGame.tsx';
import SnakeGame from './pages/SnakeGame/SnakeGame.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flappybird" element={<FlappyBirdGame />} />
        <Route path="/breakblocks" element={<PongGame />} />
        <Route path="/snake" element={<SnakeGame />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
