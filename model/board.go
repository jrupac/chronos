package model

// Board represents a collection of projects and related data.
type Board struct {
	ID int64
	BoardUpdate
}

// BoardUpdate represents an update of the mutable fields of a Board.
type BoardUpdate struct {
	Name        string
	Description string
	Projects    []int64
}

// NewBoard returns an instantiated Board.
func NewBoard(name string, description string, projects []int64) *Board {
	return &Board{
		BoardUpdate: BoardUpdate{
			Name:        name,
			Description: description,
			Projects:    projects,
		},
	}
}

// Update updates this Board's mutable fields with the given update.
func (m *Board) Update(update BoardUpdate) {
	m.Name = update.Name
	m.Description = update.Description
	m.Projects = update.Projects
}
