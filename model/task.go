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

// NewTask returns an instantiated Task.
func NewTask(projectID, epicID, assigneeId, stateID int64, title, description string) *Task {
	return &Task{
		ProjectID: projectID,
		TaskUpdate: TaskUpdate{
			EpicID:      epicID,
			AssigneeID:  assigneeId,
			StateID:     stateID,
			Title:       title,
			Description: description,
		},
	}
}

// Update updates this Task's mutable fields with the given update.
func (m *Task) Update(update TaskUpdate) {
	m.EpicID = update.EpicID
	m.AssigneeID = update.AssigneeID
	m.StateID = update.StateID
	m.Title = update.Title
	m.Description = update.Description
}
