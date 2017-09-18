import React from 'react';
import {Label} from 'semantic-ui-react';

const Epic = ({epic, project}) => {
  return (
      <div className="board-epic">
        <Label horizontal color='black'>
          {`${project.shortName}/E${epic.id}`}
        </Label>
        {epic.name}
      </div>
  );
};

export default Epic;
