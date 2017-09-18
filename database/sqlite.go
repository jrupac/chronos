package database

import (
	"database/sql"
	"errors"
	"flag"
	"github.com/jrupac/chronos/model"
	// SQLite3 driver
	_ "github.com/mattn/go-sqlite3"
)

const (
	dialect            = "sqlite3"
	stateTable         = "state"
	memberTable        = "member"
	projectTable       = "project"
	boardTable         = "board"
	memberProjectTable = "member_project"
	projectBoardTable  = "project_board"
	taskTable          = "task"
)

var (
	dbPath      = flag.String("sqlite_path", "", "Path to SQLite database file.")
	errUnopened = errors.New("database has not been opened")
)

// SQLiteStore represents a connection to a SQLite database.
type SQLiteStore struct {
	db *sql.DB
}

// OpenSQLite opens a connection to the flag-specified SQLite database.
func OpenSQLite() (*SQLiteStore, error) {
	if *dbPath == "" {
		return nil, errors.New("path to database must be specified")
	}

	// Enable foreign key support on the connection
	uri := *dbPath + "?_foreign_keys=1"
	db, err := sql.Open(dialect, uri)
	if err != nil {
		return nil, err
	}

	return &SQLiteStore{db: db}, nil
}

// Close closes the connection to the database.
func (d *SQLiteStore) Close() error {
	return d.db.Close()
}

/*******************************************************************************
 * State Operations
 ******************************************************************************/

// AddState inserts a new State into the corresponding table and returns an instantiated State.
func (d *SQLiteStore) AddState(state string) (ret *model.State, err error) {
	if d.db == nil {
		return nil, errUnopened
	}

	r, err := d.db.Exec(`INSERT INTO `+stateTable+` (state) VALUES($1)`, state)
	if err != nil {
		return
	}

	ret = model.NewState(state)
	ret.ID, err = r.LastInsertId()
	return
}

// EditState updates the fields of the provided `state` with the values of `update` once persisted.
func (d *SQLiteStore) EditState(state *model.State, update model.StateUpdate) error {
	if d.db == nil {
		return errUnopened
	}

	_, err := d.db.Exec(`UPDATE `+stateTable+` SET state = $1 WHERE id = $2`, update.State, state.ID)
	if err != nil {
		return err
	}

	state.Update(update)
	return nil
}

// GetStates retrieves states from the corresponding table and returns instantiated States.
func (d *SQLiteStore) GetStates() (ret []*model.State, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	rows, err := d.db.Query(`SELECT id, state FROM ` + stateTable)
	defer rows.Close()
	if err != nil {
		return
	}

	for rows.Next() {
		m := &model.State{}
		if err = rows.Scan(&m.ID, &m.State); err != nil {
			return
		}
		ret = append(ret, m)
	}
	return
}

// DeleteState deletes a given state, sets the given state to nil, and returns number of rows affected.
func (d *SQLiteStore) DeleteState(state *model.State) (ret int64, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	r, err := d.db.Exec(`DELETE FROM `+stateTable+` WHERE id = $1`, state.ID)
	if err != nil {
		return ret, err
	}

	state = nil
	return r.RowsAffected()
}

/*******************************************************************************
 * Member Operations
 ******************************************************************************/

// AddMember inserts a new Member into the corresponding table and returns an instantiated Member.
func (d *SQLiteStore) AddMember(username string) (ret *model.Member, err error) {
	if d.db == nil {
		return nil, errUnopened
	}

	r, err := d.db.Exec(`INSERT INTO `+memberTable+` (username) VALUES($1)`, username)
	if err != nil {
		return
	}

	ret = model.NewMember(username)
	ret.ID, err = r.LastInsertId()
	return
}

// EditMember updates the fields of the provided `member` with the values of `update` once persisted.
func (d *SQLiteStore) EditMember(_ *model.Member, _ model.MemberUpdate) error {
	if d.db == nil {
		return errUnopened
	}
	return errors.New("no mutable fields on member")
}

// GetMembers retrieves members from the corresponding table and returns instantiated Members.
func (d *SQLiteStore) GetMembers() (ret []*model.Member, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	rows, err := d.db.Query(`SELECT id, username FROM ` + memberTable)
	defer rows.Close()
	if err != nil {
		return
	}

	for rows.Next() {
		m := &model.Member{}
		if err = rows.Scan(&m.ID, &m.Username); err != nil {
			return
		}
		ret = append(ret, m)
	}
	return
}

// DeleteMember deletes a given member, sets the given member to nil, and returns number of rows affected.
func (d *SQLiteStore) DeleteMember(member *model.Member) (ret int64, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	r, err := d.db.Exec(`DELETE FROM `+memberTable+` WHERE id = $1`, member.ID)
	if err != nil {
		return ret, err
	}

	member = nil
	return r.RowsAffected()
}

/*******************************************************************************
 * Project Operations
 ******************************************************************************/

// AddProject inserts a new Project into the corresponding table and returns an instantiated Project.
func (d *SQLiteStore) AddProject(name, description string, members []int64) (ret *model.Project, err error) {
	if d.db == nil {
		return nil, errUnopened
	}

	workFunc := func(tx *sql.Tx) error {
		r, err := tx.Exec(
			`INSERT INTO `+projectTable+` (name, description, active) VALUES($1, $2, $3)`,
			name, description, true)
		if err != nil {
			return err
		}

		ret = model.NewProject(name, description, true, []int64{})
		ret.ID, err = r.LastInsertId()

		stmt, err := tx.Prepare(
			`INSERT INTO ` + memberProjectTable + ` (member_id, project_id) VALUES($1, $2)`)
		if err != nil {
			return err
		}

		for _, id := range members {
			if _, err = stmt.Exec(id, ret.ID); err != nil {
				return err
			}
		}

		ret.Members = members
		return nil
	}
	err = d.doTx(workFunc, emptyFunc, emptyFunc)
	return
}

// EditProject updates the fields of the provided `project` with the values of `update` once persisted.
func (d *SQLiteStore) EditProject(project *model.Project, update model.ProjectUpdate) (err error) {
	if d.db == nil {
		return errUnopened
	}

	successFunc := func() {
		project.Update(update)
	}

	workFunc := func(tx *sql.Tx) error {
		_, err = tx.Exec(
			`UPDATE `+projectTable+` SET name = $1, description = $2 WHERE id = $3`,
			update.Name, update.Description, project.ID)
		if err != nil {
			return err
		}

		stmt, err := tx.Prepare(
			`INSERT OR REPLACE INTO ` + memberProjectTable + ` (member_id, project_id) VALUES($1, $2)`)
		if err != nil {
			return err
		}

		for _, id := range update.Members {
			if _, err = stmt.Exec(id, project.ID); err != nil {
				return err
			}
		}
		return nil
	}

	err = d.doTx(workFunc, successFunc, emptyFunc)
	return
}

// GetProjects retrieves projects from the corresponding table and returns instantiated Projects.
func (d *SQLiteStore) GetProjects() (ret []*model.Project, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	failureFunc := func() {
		// Don't return partial results
		ret = nil
	}

	workFunc := func(tx *sql.Tx) error {
		// Retrieve all projects first
		rows, err := tx.Query(`SELECT id, name, description, active FROM ` + projectTable)
		defer rows.Close()
		if err != nil {
			return err
		}

		for rows.Next() {
			m := &model.Project{}
			if err = rows.Scan(&m.ID, &m.Name, &m.Description, &m.Active); err != nil {
				return err
			}
			ret = append(ret, m)
		}

		// Then retrieve all members for each project
		stmt, err := tx.Prepare(
			`SELECT member_id FROM ` + memberProjectTable + ` WHERE project_id = $1`)
		if err != nil {
			return err
		}

		for _, p := range ret {
			rows, err := stmt.Query(p.ID)
			defer rows.Close()
			if err != nil {
				return err
			}

			var memberID int64
			for rows.Next() {
				rows.Scan(&memberID)
				p.Members = append(p.Members, memberID)
			}
		}

		return nil
	}

	err = d.doTx(workFunc, emptyFunc, failureFunc)
	return
}

// DeleteProject deletes a given project, sets the given project to nil, and returns number of rows affected.
func (d *SQLiteStore) DeleteProject(project *model.Project) (ret int64, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	// Corresponding rows of other tables are deleted by cascade
	r, err := d.db.Exec(`DELETE FROM `+projectTable+` WHERE id = $1`, project.ID)
	if err != nil {
		return ret, err
	}

	project = nil
	return r.RowsAffected()
}

/*******************************************************************************
 * Board Operations
 ******************************************************************************/

// AddBoard inserts a new Board into the corresponding table and returns an instantiated Board.
func (d *SQLiteStore) AddBoard(name, description string, projects []int64) (ret *model.Board, err error) {
	if d.db == nil {
		return nil, errUnopened
	}

	workFunc := func(tx *sql.Tx) error {
		r, err := tx.Exec(`INSERT INTO `+boardTable+` (name, description) VALUES($1, $2)`, name, description)
		if err != nil {
			return err
		}

		ret = model.NewBoard(name, description, []int64{})
		ret.ID, err = r.LastInsertId()

		stmt, err := tx.Prepare(
			`INSERT INTO ` + projectBoardTable + ` (project_id, board_id) VALUES($1, $2)`)
		if err != nil {
			return err
		}

		for _, id := range projects {
			if _, err = stmt.Exec(id, ret.ID); err != nil {
				return err
			}
		}

		ret.Projects = projects
		return nil
	}

	err = d.doTx(workFunc, emptyFunc, emptyFunc)
	return
}

// EditBoard updates the fields of the provided `board` with the values of `update` once persisted.
func (d *SQLiteStore) EditBoard(board *model.Board, update model.BoardUpdate) (err error) {
	if d.db == nil {
		return errUnopened
	}

	successFunc := func() {
		board.Update(update)
	}

	workFunc := func(tx *sql.Tx) error {
		_, err = tx.Exec(
			`UPDATE `+boardTable+` SET name = $1, description = $2 WHERE id = $3`,
			update.Name, update.Description, board.ID)
		if err != nil {
			return err
		}

		stmt, err := tx.Prepare(
			`INSERT OR REPLACE INTO ` + projectBoardTable + ` (project_id, board_id) VALUES($1, $2)`)
		if err != nil {
			return err
		}

		for _, id := range update.Projects {
			if _, err = stmt.Exec(id, board.ID); err != nil {
				return err
			}
		}
		return nil
	}

	err = d.doTx(workFunc, successFunc, emptyFunc)
	return
}

// GetBoards retrieves boards from the corresponding table and returns instantiated Boards.
func (d *SQLiteStore) GetBoards() (ret []*model.Board, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	failureFunc := func() {
		// Don't return partial results
		ret = nil
	}

	workFunc := func(tx *sql.Tx) error {
		// Retrieve all boards first
		rows, err := tx.Query(`SELECT id, name, description FROM ` + boardTable)
		defer rows.Close()
		if err != nil {
			return err
		}

		for rows.Next() {
			m := &model.Board{}
			if err = rows.Scan(&m.ID, &m.Name, &m.Description); err != nil {
				return err
			}
			ret = append(ret, m)
		}

		// Then retrieve all projects for each board
		stmt, err := tx.Prepare(
			`SELECT project_id FROM ` + projectBoardTable + ` WHERE board_id = $1`)
		if err != nil {
			return err
		}

		for _, p := range ret {
			rows, err := stmt.Query(p.ID)
			defer rows.Close()
			if err != nil {
				return err
			}

			var projectID int64
			for rows.Next() {
				rows.Scan(&projectID)
				p.Projects = append(p.Projects, projectID)
			}
		}

		return nil
	}

	err = d.doTx(workFunc, emptyFunc, failureFunc)
	return
}

// DeleteBoard deletes a given board, sets the given board to nil, and returns number of rows affected.
func (d *SQLiteStore) DeleteBoard(board *model.Board) (ret int64, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	// Corresponding rows of other tables are deleted by cascade
	r, err := d.db.Exec(`DELETE FROM `+boardTable+` WHERE id = $1`, board.ID)
	if err != nil {
		return ret, err
	}

	board = nil
	return r.RowsAffected()
}

/*******************************************************************************
 * Task Operations
 ******************************************************************************/
// TODO: Add support for epics.

// AddTask inserts a new Task into the corresponding table and returns an instantiated Task.
func (d *SQLiteStore) AddTask(projectID, assigneeID, stateID int64, title, description string) (ret *model.Task, err error) {
	if d.db == nil {
		return nil, errUnopened
	}

	r, err := d.db.Exec(`INSERT INTO `+taskTable+` (project_id, assignee_id, state_id, title, description) `+
		`VALUES($1, $2, $3, $4, $5)`,
		projectID, assigneeID, stateID, title, description)
	if err != nil {
		return
	}

	ret = model.NewTask(projectID, 0, assigneeID, stateID, title, description)
	ret.ID, err = r.LastInsertId()
	return
}

// EditTask updates the fields of the provided `task` with the values of `update` once persisted.
func (d *SQLiteStore) EditTask(task *model.Task, update model.TaskUpdate) (err error) {
	if d.db == nil {
		return errUnopened
	}

	_, err = d.db.Exec(
		`UPDATE `+taskTable+` SET assignee_id = $1, state_id = $2, title = $3, description = $4 WHERE id = $5`,
		update.AssigneeID, update.StateID, update.Title, update.Description, task.ID)
	return
}

// GetTasks retrieves tasks for the requested project and returns instantiated Tasks.
func (d *SQLiteStore) GetTasksWithProject(projectID int64) (ret []*model.Task, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	rows, err := d.db.Query(
		`SELECT id, project_id, assignee_id, state_id, title, description FROM `+taskTable+` WHERE project_id = $1`, projectID)
	defer rows.Close()
	if err != nil {
		return
	}

	for rows.Next() {
		m := &model.Task{}
		if err = rows.Scan(&m.ID, &m.ProjectID, &m.AssigneeID, &m.StateID, &m.Title, &m.Description); err != nil {
			// Don't return partial results
			return nil, err
		}
		ret = append(ret, m)
	}

	return
}

// GetTasks retrieves tasks for the requested state and returns instantiated Tasks.
func (d *SQLiteStore) GetTasksWithState(stateID int64) (ret []*model.Task, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	rows, err := d.db.Query(
		`SELECT id, project_id, assignee_id, state_id, title, description FROM `+taskTable+` WHERE state_id = $1`, stateID)
	defer rows.Close()
	if err != nil {
		return
	}

	for rows.Next() {
		m := &model.Task{}
		if err = rows.Scan(&m.ID, &m.ProjectID, &m.AssigneeID, &m.StateID, &m.Title, &m.Description); err != nil {
			// Don't return partial results
			return nil, err
		}
		ret = append(ret, m)
	}

	return
}

// GetTasks retrieves tasks for the requested assignee and returns instantiated Tasks.
func (d *SQLiteStore) GetTasksWithAssignee(assigneeID int64) (ret []*model.Task, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	rows, err := d.db.Query(
		`SELECT id, project_id, assignee_id, state_id, title, description FROM `+taskTable+` WHERE assignee_id = $1`, assigneeID)
	defer rows.Close()
	if err != nil {
		return
	}

	for rows.Next() {
		m := &model.Task{}
		if err = rows.Scan(&m.ID, &m.ProjectID, &m.AssigneeID, &m.StateID, &m.Title, &m.Description); err != nil {
			// Don't return partial results
			return nil, err
		}
		ret = append(ret, m)
	}

	return
}

// DeleteTask deletes a given task, sets the given task to nil, and returns number of rows affected.
func (d *SQLiteStore) DeleteTask(task *model.Task) (ret int64, err error) {
	if d.db == nil {
		return ret, errUnopened
	}

	// Corresponding rows of other tables are deleted by cascade
	r, err := d.db.Exec(`DELETE FROM `+taskTable+` WHERE id = $1`, task.ID)
	if err != nil {
		return ret, err
	}

	task = nil
	return r.RowsAffected()
}
