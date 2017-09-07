import Card from 'antd/lib/card';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import React, {Component} from 'react';
import Dotdotdot from 'react-dotdotdot';
import {Responsive, WidthProvider} from 'react-grid-layout';
// Include RGL stylesheets
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import './Chronos.css';

import Board from './components/Board';
import Task from './components/Task';

const {Header, Content} = Layout;
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const breakpoints = {'lg': 1200};
const cols = {'lg': 4};
const rowHeight = 25;
const menuItems = Array.from(['Board']);

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
        <Layout>
          <Header style={{position: 'fixed', width: '100%'}}>
            <div className="logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['Board']}
                style={{lineHeight: '64px'}}>
              {
                menuItems.map((e) => {
                  return <Menu.Item key={e}>{e}</Menu.Item>;
                })
              }
            </Menu>
          </Header>
          <Content style={{padding: '0 50px', marginTop: 64}}>
            <ResponsiveReactGridLayout
                className="layout"
                breakpoints={breakpoints}
                cols={cols}
                isResizable={false}
                margin={[1, 1]}
                rowHeight={rowHeight}>
              {loadData()}
            </ResponsiveReactGridLayout>
          </Content>
        </Layout>
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
          <div className="board-state" >
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
          <Card

              title={e.title}
              bodyStyle={{padding: 0}}>
            <Dotdotdot className="board-task-description" clamp="auto">
              {e.description}
            </Dotdotdot>
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
