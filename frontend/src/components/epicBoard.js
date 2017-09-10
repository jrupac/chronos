import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import Epic from './epic';
import Task from './task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const EpicBoard = ({epic, epicTasks, states, boardProps}) => {
  const {breakpoints, cols, rowHeight} = boardProps;
  const {epicWidth, epicHeight, taskWidth, taskHeight} = boardProps;

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
              'w': epicWidth,
              'h': epicHeight,
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
                  'w': taskWidth,
                  'h': taskHeight,
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
