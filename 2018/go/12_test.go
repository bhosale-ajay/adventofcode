package main

import (
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

func Test12(t *testing.T) {
	assert.Equal(t, 2542, growPlants("12", 20), "12 01")
	assert.Equal(t, 2550000000883, growPlants("12", 50000000000), "12 01")
}

func parse12(ip string) (string, map[string]string) {
	lines := strings.Split(strings.TrimSpace(fetchInput(ip)), "\n")
	initialState := strings.Split(lines[0], ": ")[1]
	combinations := map[string]string{}
	for li, l := range lines {
		if li < 2 {
			continue
		}
		lParts := strings.Split(l, " => ")
		combinations[lParts[0]] = lParts[1]
	}
	return initialState, combinations
}

func growPlants(ip string, generationsToWatch int) int {
	pots, combinations := parse12(ip)
	var sum, lastSum, lastDiff, streak int
	for generation := 1; generation <= generationsToWatch; generation++ {
		pots = "...." + pots + "...."
		runes := []rune(pots)
		grownPots := ""
		sum = 0
		for i := 2; i <= len(pots)-3; i++ {
			key := string(runes[i-2 : i+3])
			pot := combinations[key]
			if pot == "#" {
				sum = sum + i + ((generation * -2) - 2)
			}
			grownPots = grownPots + pot
		}
		pots = grownPots
		if sum-lastSum == lastDiff {
			streak = streak + 1
			if streak == 3 {
				return (generationsToWatch-generation)*lastDiff + sum
			}
		} else {
			lastDiff = sum - lastSum
			streak = 0
		}
		lastSum = sum
	}
	return sum
}
