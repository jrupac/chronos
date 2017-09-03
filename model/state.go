package model

// State represents a state that a task can be in.
type State struct {
	ID int64
	StateUpdate
}

// StateUpdate represents an update of the mutable fields of a State.
type StateUpdate struct {
	State string
}

func NewState(state string) *State {
	return &State{StateUpdate: StateUpdate{State: state}}
}

func (m *State) Update(update StateUpdate) {
	m.State = update.State
}
