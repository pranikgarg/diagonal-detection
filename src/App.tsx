import { JSX, useCallback, useEffect, useState } from "react";
import "./App.css";

// Define the shape of the grid
interface Grid {
  rows: number;
  cols: number;
}

function App() {
  // Grid dimensions (10x10)
  const grid: Grid = { rows: 10, cols: 10 };

  // State to store all rendered cell elements
  const [cells, setCells] = useState<JSX.Element[]>([]);

  // State to store coordinates of all diagonally active cells
  const [activeCells, setActiveCells] = useState<number[][]>([]);

  // State to track the currently selected cell
  const [selectedCell, setSelectedCell] = useState<number[]>([]);

  // Handle click on a cell and update selected + active cells
  const handleClick = useCallback(
    (row: number, col: number) => {
      setSelectedCell([row, col]);

      const activeBoxes: number[][] = [];

      // Top-left diagonal
      let tempRow = row;
      let tempCol = col;
      while (tempRow > 0 && tempCol > 0) {
        tempRow -= 1;
        tempCol -= 1;
        activeBoxes.push([tempRow, tempCol]);
      }

      // Top-right diagonal
      tempRow = row;
      tempCol = col;
      while (tempRow > 0 && tempCol < grid.cols - 1) {
        tempRow -= 1;
        tempCol += 1;
        activeBoxes.push([tempRow, tempCol]);
      }

      // Bottom-left diagonal
      tempRow = row;
      tempCol = col;
      while (tempRow < grid.rows - 1 && tempCol > 0) {
        tempRow += 1;
        tempCol -= 1;
        activeBoxes.push([tempRow, tempCol]);
      }

      // Bottom-right diagonal
      tempRow = row;
      tempCol = col;
      while (tempRow < grid.rows - 1 && tempCol < grid.cols - 1) {
        tempRow += 1;
        tempCol += 1;
        activeBoxes.push([tempRow, tempCol]);
      }

      // Update the active diagonal cells
      setActiveCells(activeBoxes);
    },
    [grid.cols, grid.rows]
  );

  // Compute class names based on current state
  const getClassName = useCallback(
    (row: number, col: number): string => {
      // Highlight the selected cell
      if (selectedCell?.[0] === row && selectedCell?.[1] === col) {
        return "cell selected";
      }
      // Highlight active diagonal cells
      if (activeCells.some(([r, c]) => r === row && c === col)) {
        return "cell active";
      }
      // Default class
      return "cell";
    },
    [activeCells, selectedCell]
  );

  // Render the grid of cells based on current state
  useEffect(() => {
    const setGrids = () => {
      const temp: JSX.Element[] = [];

      // Generate each cell in the grid
      for (let row = 0; row < grid.rows; row += 1) {
        for (let col = 0; col < grid.cols; col += 1) {
          temp.push(
            <div
              key={`${row}-${col}`}
              className={getClassName(row, col)}
              onClick={() => handleClick(row, col)}
            ></div>
          );
        }
      }

      // Save the generated cells
      setCells(temp);
    };

    // Regenerate cells when dependencies change
    setGrids();
  }, [handleClick, getClassName, grid.cols, grid.rows]);

  // Render the app
  return (
    <div>
      <h1>Diagonal Detection Application</h1>
      <div className="grid">{cells}</div>
    </div>
  );
}

export default App;
