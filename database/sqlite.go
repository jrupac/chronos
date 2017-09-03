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
	dialect     = "sqlite3"
	stateTable  = "state"
	memberTable = "member"
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

	db, err := sql.Open(dialect, *dbPath)
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
