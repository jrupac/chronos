import React, {Component} from 'react';
import Dotdotdot from 'react-dotdotdot';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {Card, Label, Menu} from 'semantic-ui-react';

import State from './components/State';
import Task from './components/Task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const breakpoints = {'lg': 1200};
const cols = {'lg': 4};
const rowHeight = 30;
const menuItems = Array.from(['Boards', 'Projects']);
const activeItem = 'Boards';

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
        <div>
          <Menu pointing color="blue" inverted size="huge">
            <Menu.Item key='logo' name='Chronos' className='logo'/>
            {menuItems.map((e) => (
                <Menu.Item key={e} name={e} active={activeItem === e}/>
            ))}
          </Menu>
          <ResponsiveReactGridLayout
              className="main-board"
              breakpoints={breakpoints}
              cols={cols}
              isResizable={false}
              margin={[1, 1]}
              rowHeight={rowHeight}>
            {loadData()}
          </ResponsiveReactGridLayout>
          <EpicBoard/>
        </div>
    );
  }
}

// Sample data

class EpicBoard extends Component {
  render() {
    const tasks = Array.from([
      new Task(
          4, 0, 0, 0, 2, 'Foo bar', 'fo fo foo sjk jksf.'),
      new Task(
          5, 0, 0, 0, 1, 'Foo bar2', 'fo fo foo sjk jksf2.'),
      new Task(
          6, 0, 0, 0, 4, 'Foo bar3', 'fo fo foo sjk jksf3.'),
    ]);
    const colYIndex = new Map();

    return (
        <ResponsiveReactGridLayout
            className="epic-board"
            breakpoints={breakpoints}
            cols={cols}
            isResizable={false}
            margin={[0, 0]}
            rowHeight={rowHeight}>
          <div
              key={'epic2'}
              data-grid={{
                'w': 4,
                'h': 1,
                'i': String('epic2'),
                'x': 0,
                'y': 0,
                'static': true,
              }}
              className="board-epic-wrapper">
            <Epic/>
          </div>

          {tasks.map((e) => {
            colYIndex.set(e.stateId, (colYIndex.get(e.stateId) || 1) + 1);
            return <div
                key={'task' + e.id}
                data-grid={{
                  'w': 1,
                  'h': 5,
                  'i': String(e.id),
                  'x': stateToCol.get(e.stateId),
                  'y': colYIndex.get(e.stateId),
                }}
                className="board-task-wrapper">
              <Card fluid raised>
                <Card.Content>
                  <Card.Header>
                    <Label horizontal color='brown'>
                      {'PRJ-' + e.id}
                    </Label>
                    {e.title}
                  </Card.Header>

                  <Card.Description>

                    <Dotdotdot clamp="auto" children={e.description}/>
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>;
          })}

        </ResponsiveReactGridLayout>
    );
  }
}

class Epic extends Component {
  render() {
    return (
        <div className="board-epic">
          <Label horizontal color='brown'>
            {'E-1'}
          </Label>
          {'Epic1'}
        </div>
    );
  }
}

const stateToCol = new Map([[1, 0], [2, 1], [3, 2], [4, 3]]);

const loadStates = () => {
  const headerRows = [];
  let i = 0;
  const states = Array.from([
    new State(1, 'Unstarted'),
    new State(2, 'In Progress'),
    new State(3, 'Blocked'),
    new State(4, 'Done'),
  ]);

  states.forEach((e) => {
    headerRows.push(
        <div
            key={'state' + e.id}
            data-grid={
              {
                'w': 1,
                'h': 1,
                'i': String(e.id),
                'x': i++,
                'y': 0,
                'static': true,
              }}
            className="board-state-wrapper">
          <div className="board-state">
            {e.state}
          </div>
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
    new Task(
        3, 0, 0, 0, 2, 'Mock up all frontend interactions',
        'Create mock entries for everything that needs to be fetched from ' +
        'the server to make it easier to create the frontend.'),
  ]);
  const colYIndex = new Map();

  tasks.forEach((e) => {
    colYIndex.set(e.stateId, (colYIndex.get(e.stateId) || 0) + 1);
    taskRows.push(
        <div
            key={'task' + e.id}
            data-grid={{
              'w': 1,
              'h': 5,
              'i': String(e.id),
              'x': stateToCol.get(e.stateId),
              'y': colYIndex.get(e.stateId),
            }}
            className="board-task-wrapper">
          <Card fluid raised>
            <Card.Content>
              <Card.Header>
                <Label horizontal color='brown'>
                  {'PRJ-' + e.id}
                </Label>
                {e.title}
              </Card.Header>

              <Card.Description>
                <Dotdotdot clamp="auto" children={e.description}/>
              </Card.Description>
            </Card.Content>
          </Card>
        </div>
    );
  });

  return taskRows;
};

const loadData = () => {
  return [...loadStates(), ...loadTasks()];
};

export default Chronos;
