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
