package model

// Epic represents a grouping of tasks in a project.
type Epic struct {
	ID        int64
	ProjectID int64
	EpicUpdate
}

// EpicUpdate represents an update of the mutable fields of an Epic.
type EpicUpdate struct {
	Name   string
	Active bool
}

// NewEpic returns an instantiated Epic.
func NewEpic(name string, active bool) *Epic {
	return &Epic{EpicUpdate: EpicUpdate{Name: name, Active: active}}
}

// Update updates this Epic's mutable fields with the given update.
func (m *Epic) Update(update EpicUpdate) {
	m.Name = update.Name
	m.Active = update.Active
}
