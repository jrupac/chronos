import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import State from './state';
import Task from './task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const MainBoard = ({tasks, states, breakpoints, cols, rowHeight}) => {
  return (
      <ResponsiveReactGridLayout
          className="main-board"
          breakpoints={breakpoints}
          cols={cols}
          isResizable={false}
          margin={[1, 1]}
          rowHeight={rowHeight}>

        {/* Render states */}
        {Array.from(states.values(), (e) => (
            <div
                key={`state-${e.id}`}
                data-grid={
                  {
                    'w': 1,
                    'h': 1,
                    'i': `state-${e.id}`,
                    'x': e.col,
                    'y': 0,
                    'static': true,
                  }}
                className="board-state-wrapper">
              <State state={e}/>
            </div>
        ))}

        {/* Render tasks not in epics */}
        {tasks.map((e) => (
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

export default MainBoard;
