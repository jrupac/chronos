import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import State from './state';
import Task from './task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const MainBoard = ({tasks, states, projects, boardProps}) => {
  const {breakpoints, cols, rowHeight} = boardProps;
  const {stateWidth, stateHeight, taskWidth, taskHeight} = boardProps;

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
                    'w': stateWidth,
                    'h': stateHeight,
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
                  'w': taskWidth,
                  'h': taskHeight,
                  'i': `task-${e.id}`,
                  'x': states.get(e.stateID).col,
                  'y': 0,
                }}
                className="board-task-wrapper">
              <Task task={e} project={projects.get(e.projectID)}/>
            </div>
        ))}
      </ResponsiveReactGridLayout>
  );
};

export default MainBoard;
