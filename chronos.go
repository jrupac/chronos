package main

import (
	"flag"
	log "github.com/golang/glog"
	"github.com/jrupac/chronos/database"
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

	i, err := d.DeleteMember(m)
	if err != nil {
		log.Fatalf("Unable to delete member: %s", err)
	} else {
		log.Infof("Deleted %d member(s).", i)
	}

	// State tests
	s, err := d.AddState("UNSTARTED")
	if err != nil {
		log.Fatalf("Unable to create state: %s", err)
	}
	utils.DebugPrint("Inserted state", s)

	sl, err := d.GetStates()
	if err != nil {
		log.Fatalf("Unable to retrieve state(s): %s", err)
	}
	utils.DebugPrint("Retrieved state(s)", sl)

	i, err = d.DeleteState(s)
	if err != nil {
		log.Fatalf("Unable to delete state: %s", err)
	} else {
		log.Infof("Deleted %d state(s).", i)
	}
}
