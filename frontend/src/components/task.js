import React from 'react';
import {Card, Label} from 'semantic-ui-react';
import Dotdotdot from 'react-dotdotdot';

const Task = ({task}) => {
  return (
      <Card fluid raised>
        <Card.Content>
          <Card.Header>
            <Label horizontal color='brown'>
              {'PRJ-' + task.id}
            </Label>
            {task.title}
          </Card.Header>
          <Card.Description>
            <Dotdotdot clamp="auto" children={task.description}/>
          </Card.Description>
        </Card.Content>
      </Card>
  );
};

export default Task;
