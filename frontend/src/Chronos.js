import React, {Component} from 'react';
import Dotdotdot from 'react-dotdotdot';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {Card, Label} from 'semantic-ui-react';
import Task from './components/Task';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const breakpoints = {'lg': 1200};
const cols = {'lg': 4};
const rowHeight = 30;

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
          <EpicBoard/>
        </div>
    );
  }
}

// Sample data (currently broken...)

const epicTasks = Array.from([
  new Task(
      4, 0, 0, 0, 2, 'Foo bar', 'fo fo foo sjk jksf.'),
  new Task(
      5, 0, 0, 0, 1, 'Foo bar2', 'fo fo foo sjk jksf2.'),
  new Task(
      6, 0, 0, 0, 4, 'Foo bar3', 'fo fo foo sjk jksf3.'),
]);


class EpicBoard extends Component {
  render() {
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

          {epicTasks.map((e) => {
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

export default Chronos;
