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

// NewProject returns an instantiated Project.
func NewProject(name string, description string, members []int64) *Project {
	return &Project{
		ProjectUpdate: ProjectUpdate{
			Name:        name,
			Description: description,
			Members:     members,
		},
	}
}

// Update updates this Project's mutable fields with the given update.
func (m *Project) Update(update ProjectUpdate) {
	m.Name = update.Name
	m.Description = update.Description
	m.Members = update.Members
}
