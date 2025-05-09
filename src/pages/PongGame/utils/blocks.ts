const numColumns = 5;
const numRows = 2;
const blockHeight = 50;

const getRandomColor = () => {
  const red = Math.floor(Math.random() * 128 + 127);
  const green = Math.floor(Math.random() * 128 + 127);
  const blue = Math.floor(Math.random() * 128 + 127);
  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

export const calculateBlockPositions = () => {
  const blockGap = 10;
  const blocksArray = [];

  const totalGapWidth = (numColumns - 1) * blockGap;
  const availableWidth = window.innerWidth - totalGapWidth;
  const calculatedBlockWidth = availableWidth / numColumns;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numColumns; col++) {
      const x = col * (calculatedBlockWidth + blockGap);
      const y = 50 + row * (blockHeight + blockGap);

      blocksArray.push({
        x,
        y,
        width: calculatedBlockWidth,
        height: blockHeight,
        isDestroyed: false,
        color: getRandomColor(),
      });
    }
  }

  return blocksArray;
};  