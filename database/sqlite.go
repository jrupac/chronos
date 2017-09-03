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
	Member Operations
 ******************************************************************************/

// CreateMember inserts a new Member into the corresponding table and returns an instantiated Member.
func (d *SQLiteStore) CreateMember(username string) (ret *model.Member, err error) {
	if d.db == nil {
		return nil, errUnopened
	}

	r, err := d.db.Exec(`INSERT INTO `+memberTable+` (username) VALUES($1)`, username)
	if err != nil {
		return
	}

	ret = &model.Member{Username: username}
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

// DeleteMember deletes a given member from the corresponding table and set the given member to nil.
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
