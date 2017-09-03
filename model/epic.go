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
