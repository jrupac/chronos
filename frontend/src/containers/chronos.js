import React, {Component} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {connect} from 'react-redux';
import {Menu} from 'semantic-ui-react';
import {EMPTY_EPIC} from '../actions/epic';
import EpicBoard from '../components/epicBoard';
import State from '../components/state';
import Task from '../components/task';

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
    let {tasks, states, epics} = this.props;
    console.log(epics);

    const nonEpicTasks = tasks.filter((e) => e.epicID === EMPTY_EPIC);

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
            {nonEpicTasks.map((e) => (
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

          {epics.map((epic) => {
            const epicTasks = tasks.filter((e) => e.epicID === epic.id);
            return <EpicBoard
                key={epic.id}
                epic={epic}
                epicTasks={epicTasks}
                states={states}
            />;
          })};

        </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  let {tasks, states, epics} = state;

  return {
    tasks,
    'states': states.states,
    'epics': epics.epics,
  };
};

export default connect(mapStateToProps)(Chronos);
