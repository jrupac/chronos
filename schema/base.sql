PRAGMA FOREIGN_KEYS = ON;

CREATE TABLE IF NOT EXISTS state (
  -- Metadata columns
  id INTEGER PRIMARY KEY,
  -- Data columns
  state TEXT UNIQUE
);

-- Initialize `state` table with default values.
INSERT INTO state (state) VALUES
  ('Backlog'), ('Unstarted'), ('In Progress'), ('Blocked'), ('Done');

CREATE TABLE IF NOT EXISTS member (
  -- Metadata columns
  id INTEGER PRIMARY KEY,
  -- Data columns
  username TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS project (
  -- Metadata columns
  id INTEGER PRIMARY KEY,
  -- Data columns
  name TEXT,
  description TEXT,
  active BOOLEAN
);

CREATE TABLE IF NOT EXISTS board (
  -- Metadata columns
  id INTEGER PRIMARY KEY,
  -- Data columns
  name TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS member_project (
  -- Metadata columns
  member_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, project_id)
);

CREATE TABLE IF NOT EXISTS project_board (
  -- Metadata columns
  project_id INTEGER NOT NULL,
  board_id INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
  FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, board_id)
);

CREATE TABLE IF NOT EXISTS epic (
  -- Metadata columns
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  -- Data columns
  name TEXT,
  active BOOLEAN,
  -- Constraints
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS project_epic on epic (project_id, id);

CREATE TABLE IF NOT EXISTS task (
  -- Metadata columns
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  epic_id INTEGER,
  assignee_id INTEGER,
  state_id INTEGER NOT NULL,
  -- Data columns
  title TEXT,
  description TEXT,
  -- Constraints
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
  FOREIGN KEY (epic_id) REFERENCES epic(id) ON DELETE NO ACTION,
  FOREIGN KEY (assignee_id) REFERENCES member(id) ON DELETE NO ACTION,
  FOREIGN KEY (state_id) REFERENCES state(id) ON DELETE NO ACTION
);

CREATE UNIQUE INDEX IF NOT EXISTS project_task ON task (project_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS epic_task ON task (epic_id, id) WHERE epic_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS assignee_task on task (assignee_id, id) WHERE assignee_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS state_task on task (state_id, id) WHERE state_id IS NOT NULL;