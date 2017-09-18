import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import Epic from './epic';
import Task from './task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const EpicBoard = ({epic, epicTasks, states, projects, boardProps}) => {
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
          <Epic epic={epic} project={projects.get(epic.projectID)}/>
        </div>

        {/* Render tasks in this epic */}
        {epicTasks.map((e) => (
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

export default EpicBoard;
