import React from 'react';

const State = ({state}) => {
  return (
      <div className="board-state">
        {state.state}
      </div>
  );
};

export default State;
