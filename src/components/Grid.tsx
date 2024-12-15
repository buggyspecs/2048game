import React from 'react';
import { Tile } from './Tile';
import { Grid as GridType } from '../types/game';

interface GridProps {
  grid: GridType;
  previousGrid: GridType | null;
}

export const Grid: React.FC<GridProps> = ({ grid, previousGrid }) => {
  return (
    <div className="relative bg-[#bbada0] p-3 rounded-lg w-full">
      {/* Static background grid */}
      <div className="grid grid-cols-4 gap-3">
        {Array(16).fill(null).map((_, i) => (
          <div key={`cell-${i}`} className="grid-cell">
            <div className="grid-cell-content bg-[#cdc1b4] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Dynamic tiles layer */}
      <div 
        className="absolute inset-0 p-3 grid grid-cols-4 grid-rows-4 gap-3"
      >
        {grid.map((row, i) =>
          row.map((value, j) => {
            if (!value) return null;
            const isNew = previousGrid && previousGrid[i][j] === null && value !== null;
            const hasMoved = previousGrid && previousGrid[i][j] !== grid[i][j];
            
            return (
              <Tile
                key={`${i}-${j}-${value}`}
                value={value}
                isNew={isNew}
                hasMoved={hasMoved}
                position={{ row: i, col: j }}
              />
            );
          })
        ).flat()}
      </div>
    </div>
  );
};