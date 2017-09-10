import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Menu} from 'semantic-ui-react';
import {EMPTY_EPIC} from '../actions/epic';
import EpicBoard from '../components/epicBoard';
import MainBoard from '../components/mainBoard';

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
              breakpoints={breakpoints}
              cols={cols}
              rowHeight={rowHeight}
          />

          {/* Render tasks in epics as separate boards */}
          {epics.map((epic) => {
            const epicTasks = tasks.filter((e) => e.epicID === epic.id);
            return <EpicBoard
                key={epic.id}
                epic={epic}
                epicTasks={epicTasks}
                states={states}
                breakpoints={breakpoints}
                cols={cols}
                rowHeight={rowHeight}
            />;
          })};

        </div>
    );
  }
}

const mapStateToProps = (state) => {
  let {tasks, states, epics} = state;

  return {
    tasks,
    'states': states.states,
    'epics': epics.epics,
  };
};

export default connect(mapStateToProps)(Chronos);
