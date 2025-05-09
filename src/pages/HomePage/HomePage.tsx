import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

const GameMenu: React.FC = () => {
  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.title}>Панель управления игрой</h1>
      <div className={styles.menuItems}>
      <Link to="/flappybird" className={styles.menuItem}>
          <div className={styles.card}>
            <h2>Flappy Bird</h2>
            <p>Попробуйте взять под контроль птицу и избежать препятствий в этой классической игре!</p>
          </div>
        </Link>
        <Link to="/breakblocks" className={styles.menuItem}>
          <div className={styles.card}>
            <h2>Break Blocks</h2>
            <p>Разбейте все блоки, управляя мячом, и победите в этой увлекательной игре!</p>
          </div>
        </Link>
        <Link to="/snake" className={styles.menuItem}>
          <div className={styles.card}>
            <h2>Змейка</h2>
            <p>Попробуйте не столкнуться с границами экрана и удлиняйте свою змейку!</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GameMenu;
