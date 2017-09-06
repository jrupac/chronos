package main

import (
	"flag"
	log "github.com/golang/glog"
	"github.com/jrupac/chronos/database"
	"github.com/jrupac/chronos/model"
	"github.com/jrupac/chronos/utils"
)

const version = "0.01"

func main() {
	flag.Parse()
	defer log.Flush()

	log.CopyStandardLogTo("INFO")
	log.Infof("Chronos %s.", version)

	// Testing code
	d, err := database.OpenSQLite()
	if err != nil {
		log.Fatalf("Unable to open DB: %s", err)
	}
	defer d.Close()

	// Member tests
	m, err := d.AddMember("foobar")
	if err != nil {
		log.Fatalf("Unable to create member: %s", err)
	}
	utils.DebugPrint("Inserted member", m)

	ml, err := d.GetMembers()
	if err != nil {
		log.Fatalf("Unable to retrieve member(s): %s", err)
	}
	utils.DebugPrint("Retrieved member(s)", ml)

	p, err := d.AddProject("Test Project", "Test Project Description")
	if err != nil {
		log.Fatalf("Unable to create project: %s", err)
	}
	utils.DebugPrint("Inserted project", p)

	pl, err := d.GetProjects()
	if err != nil {
		log.Fatalf("Unable to retrieve project(s): %s", err)
	}
	utils.DebugPrint("Retrieved project(s)", pl)

	// Add member to project
	u := model.ProjectUpdate{
		Name:        p.Name,
		Description: p.Description,
		Archived:    p.Archived,
		Members:     []int64{m.ID},
	}
	err = d.EditProject(p, u)
	if err != nil {
		log.Fatalf("Unable to edit project: %s", err)
	}
	utils.DebugPrint("Edited project", p)

	// State tests
	s, err := d.AddState("NEW STATE")
	if err != nil {
		log.Fatalf("Unable to create state: %s", err)
	}
	utils.DebugPrint("Inserted state", s)

	sl, err := d.GetStates()
	if err != nil {
		log.Fatalf("Unable to retrieve state(s): %s", err)
	}
	utils.DebugPrint("Retrieved state(s)", sl)

	// Task tests
	t, err := d.AddTask(p.ID, m.ID, s.ID, "test task", "test description")
	if err != nil {
		log.Fatalf("Unable to create task: %s", err)
	}
	utils.DebugPrint("Inserted task", t)

	tl, err := d.GetTasksWithProject(p.ID)
	if err != nil {
		log.Fatalf("Unable to retrieve tasks(s) with project: %s", err)
	}
	utils.DebugPrint("Retrieved task(s)", tl)

	tl, err = d.GetTasksWithAssignee(m.ID)
	if err != nil {
		log.Fatalf("Unable to retrieve tasks(s) with assginee: %s", err)
	}
	utils.DebugPrint("Retrieved task(s)", tl)

	tl, err = d.GetTasksWithState(s.ID)
	if err != nil {
		log.Fatalf("Unable to retrieve tasks(s) with state: %s", err)
	}
	utils.DebugPrint("Retrieved task(s)", tl)

	// Cleanup
	i, err := d.DeleteTask(t)
	if err != nil {
		log.Fatalf("Unable to delete task: %s", err)
	} else {
		log.Infof("Deleted %d state(s).", i)
	}

	i, err = d.DeleteProject(p)
	if err != nil {
		log.Fatalf("Unable to delete project: %s", err)
	} else {
		log.Infof("Deleted %d project(s).", i)
	}

	i, err = d.DeleteState(s)
	if err != nil {
		log.Fatalf("Unable to delete state: %s", err)
	} else {
		log.Infof("Deleted %d state(s).", i)
	}

	i, err = d.DeleteMember(m)
	if err != nil {
		log.Fatalf("Unable to delete member: %s", err)
	} else {
		log.Infof("Deleted %d member(s).", i)
	}
}
