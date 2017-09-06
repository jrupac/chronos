package database

import (
	"database/sql"
	log "github.com/golang/glog"
)

// doTx wraps workFunc with transaction handling logic and calls successFunc or failureFunc depending on the outcome.
func (d *SQLiteStore) doTx(workFunc func(*sql.Tx) error, successFunc, failureFunc func()) (err error) {
	// Call post-transaction functions before return
	defer func() {
		if p := recover(); p != nil {
			failureFunc()
			panic(p)
		} else if err != nil {
			failureFunc()
			return
		}
		successFunc()
		return
	}()

	tx, err := d.db.Begin()
	if err != nil {
		return
	}

	// Resolve the transaction in a deferred fashion
	defer func() {
		// Errors thrown here are only logged to preserve the error thrown in workFunc
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			if e := tx.Rollback(); e != nil {
				log.Warningf("failed to rollback transaction: %s", e)
			}
			return
		}
		if e := tx.Commit(); e != nil {
			log.Warningf("failed to commit transaction: %s", e)
		}
		return
	}()

	err = workFunc(tx)
	return
}

// emptyFunc is a convenience function for use with doTx.
var emptyFunc = func() {}
