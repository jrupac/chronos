package model

// Project represents a collection of tasks and related data.
type Project struct {
	ID int64
	ProjectUpdate
}

// ProjectUpdate represents an update of the mutable fields of a Project.
type ProjectUpdate struct {
	Name        string
	Description string
	Members     []int64
}
