package model

// Task represents a single task in a project.
type Task struct {
	ID        int64
	ProjectID int64
	TaskUpdate
}

// TaskUpdate represents an update of the mutable fields of a Task.
type TaskUpdate struct {
	EpicID      int64
	AssigneeID  int64
	StateID     int64
	Title       string
	Description string
}
