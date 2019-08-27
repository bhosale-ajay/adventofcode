package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"
)

func main() {
	// empty
}

func fetchInput(day string) string {
	content, err := ioutil.ReadFile(fmt.Sprintf("../inputs/%s.txt", day))
	if err != nil {
		log.Fatal(err)
	}
	return strings.TrimSpace(strings.ReplaceAll(string(content), "\r", ""))
}
