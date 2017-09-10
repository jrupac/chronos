import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import Epic from './epic';
import Task from './task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const EpicBoard = ({epic, epicTasks, states, breakpoints, cols, rowHeight}) => {
  return (
      <ResponsiveReactGridLayout
          className="epic-board"
          breakpoints={breakpoints}
          cols={cols}
          isResizable={false}
          margin={[0, 0]}
          rowHeight={rowHeight}>

        {/* Render row with epic information */}
        <div
            key={`epic-${epic.id}`}
            data-grid={{
              'w': 4,
              'h': 1,
              'i': `epic-${epic.id}`,
              'x': 0,
              'y': 0,
              'static': true,
            }}
            className="board-epic-wrapper">
          <Epic epic={epic}/>
        </div>

        {/* Render tasks in this epic */}
        {epicTasks.map((e) => (
            <div
                key={`task-${e.id}`}
                data-grid={{
                  'w': 1,
                  'h': 5,
                  'i': `task-${e.id}`,
                  'x': states.get(e.stateId).col,
                  'y': 0,
                }}
                className="board-task-wrapper">
              <Task task={e}/>
            </div>
        ))}
      </ResponsiveReactGridLayout>
  );
};

export default EpicBoard;
