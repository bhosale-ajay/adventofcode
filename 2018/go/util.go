package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
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

func parseNumber(s string) int {
	i, err := strconv.Atoi(s)
	if err == nil {
		return i
	}
	return 0
}

// Point struct
type Point struct {
	x, y int
}

func manhattanDistance(fx int, fy int, tx int, ty int) int {
	x := fx - tx
	if x < 0 {
		x *= -1
	}
	y := fy - ty
	if y < 0 {
		y *= -1
	}
	return x + y
}
