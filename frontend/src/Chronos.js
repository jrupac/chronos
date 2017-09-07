import React, {Component} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import Board from 'components/Board';
import Task from 'components/Task';
// Include RGL stylesheets
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import './Chronos.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const breakpoints = {'lg': 1200};
const cols = {'lg': 4};

/**
 * Main class.
 */
class Chronos extends Component {
  /**
   * Main render function.
   * @return {XML}
   */
  render() {
    return (
        <div className="App">
          <div className="App-header">
            Chronos
          </div>
          <ResponsiveReactGridLayout
              className="layout"
              breakpoints={breakpoints}
              cols={cols}
              isResizable={false}
              rowHeight={50}>
            {loadData()}
          </ResponsiveReactGridLayout>
        </div>
    );
  }
}

// Sample data


const stateToCol = new Map([[1, 0], [2, 1], [3, 2], [4, 3]]);

const loadStates = () => {
  const headerRows = [];
  let i = 0;
  const states = Array.from([
    new Board(1, 'Unstarted'),
    new Board(2, 'In Progress'),
    new Board(3, 'Blocked'),
    new Board(4, 'Done'),
  ]);

  states.forEach((e) => {
    headerRows.push(
        <div
            className="board-state"
            key={'state'+e.id}
            data-grid={
              {
                'w': 1,
                'h': 1,
                'i': String(e.id),
                'x': i++,
                'y': 0,
                'static': true,
              }}>
          {e.state}
        </div>
    );
  });

  return headerRows;
};

const loadTasks = () => {
  const taskRows = [];
  const tasks = Array.from([
    new Task(
        1, 0, 0, 0, 2, 'Sample Chronos frontend', 'Set up sample frontend.'),
    new Task(
        2, 0, 0, 0, 1, 'Prettify the frontend',
        'Add CSS and other layout to make it look good.'),
  ]);
  const colYIndex = new Map();

  tasks.forEach((e) => {
    colYIndex.set(e.stateId, (colYIndex.get(e.stateId) || 0) + 1);
    taskRows.push(
        <div
            className="board-task"
            key={'task'+e.id}
            data-grid={{
              'w': 1,
              'h': 2,
              'i': String(e.id),
              'x': stateToCol.get(e.stateId),
              'y': colYIndex.get(e.stateId),
            }}>
          <div className="board-task-title">
            {e.title}
          </div>
          <div className="board-task-description">
            {e.description}
          </div>
        </div>
    );
  });

  return taskRows;
};

const loadData = () => {
  return [...loadStates(), ...loadTasks()];
};

export default Chronos;
