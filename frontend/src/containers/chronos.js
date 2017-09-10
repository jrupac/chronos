import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Menu} from 'semantic-ui-react';
import {EMPTY_EPIC} from '../actions/epic';
import EpicBoard from '../components/epicBoard';
import MainBoard from '../components/mainBoard';

const menuItems = Array.from(['Boards', 'Projects']);
const activeItem = 'Boards';

const boardProps = {
  breakpoints: {'lg': 1200},
  cols: {'lg': 4},
  rowHeight: 30,
  stateWidth: 1,
  stateHeight: 1,
  taskWidth: 1,
  taskHeight: 5,
  epicWidth: 4,
  epicHeight: 1,
};

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
    const nonEpicTasks = tasks.filter((e) => e.epicID === EMPTY_EPIC);

    return (
        <div>
          <Menu pointing color="blue" inverted size="huge">
            <Menu.Item key='logo' name='Chronos' className='logo'/>
            {menuItems.map((e) => (
                <Menu.Item key={e} name={e} active={activeItem === e}/>
            ))}
          </Menu>

          {/* Render main board */}
          <MainBoard
              tasks={nonEpicTasks}
              states={states}
              boardProps={boardProps}
          />

          {/* Render tasks in epics as separate boards */}
          {epics.map((epic) => {
            const epicTasks = tasks.filter((e) => e.epicID === epic.id);
            return <EpicBoard
                key={epic.id}
                epic={epic}
                epicTasks={epicTasks}
                states={states}
                boardProps={boardProps}
            />;
          })};
        </div>
    );
  }
}

// Needs to be specified to subscribe to changes in the store.
const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(Chronos);
