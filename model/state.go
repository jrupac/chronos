package model

// State represents a state that a task can be in.
type State struct {
	Id int64
	StateUpdate
}

// StateUpdate represents an update of the mutable fields of a State.
type StateUpdate struct {
	State string
}
