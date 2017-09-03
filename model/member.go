package model

// Member represents a single user of the service.
type Member struct {
	ID       int64
	Username string
	MemberUpdate
}

// MemberUpdate represents an update of the mutable fields of a Member.
type MemberUpdate struct {
}

// NewMember returns an instantiated Member.
func NewMember(username string) *Member {
	return &Member{Username: username}
}

// Update updates this Member's mutable fields with the given update.
func (m *Member) Update(_ MemberUpdate) {
}
