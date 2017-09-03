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

	m, err := d.CreateMember("foobar")
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
}
