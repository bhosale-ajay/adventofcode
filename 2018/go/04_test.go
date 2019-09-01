package main

import (
	"github.com/stretchr/testify/assert"
	"regexp"
	"sort"
	"strings"
	"testing"
)

func Test04(t *testing.T) {
	tp1, tp2 := chooseGuard("04-test")
	p1, p2 := chooseGuard("04")
	assert.Equal(t, 240, tp1, "04 01 T01")
	assert.Equal(t, 4455, tp2, "04 02 T01")
	assert.Equal(t, 138280, p1, "04 01")
	assert.Equal(t, 89347, p2, "04 02")
}

func chooseGuard(ip string) (int, int) {
	lines := strings.Split(fetchInput(ip), "\n")
	sort.Strings(lines)
	const (
		totalMinSlept = 60
		minSleptMost  = 61
	)
	re := regexp.MustCompile(`(?m)(\d+)]\s(falls|Guard|wakes)\s[#]*(\d+)*`)
	history := map[int]map[int]int{}
	lastGurad := -1
	fallAt := -1
	mostSleptGurad := -1
	mostSleptRecord := -1
	mostSleptAtAMinGuard := -1
	mostSleptAtAMinRecord := -1
	for _, line := range lines {
		matches := re.FindStringSubmatch(line)
		if matches[2] == "Guard" {
			lastGurad = parseNumber(matches[3])
			_, ok := history[lastGurad]
			if !ok {
				history[lastGurad] = map[int]int{totalMinSlept: 0, minSleptMost: 0}
			}
		} else if matches[2] == "falls" {
			fallAt = parseNumber(matches[1])
		} else {
			guardHistory := history[lastGurad]
			for m := fallAt; m < parseNumber(matches[1]); m++ {
				guardHistory[m]++
				guardHistory[totalMinSlept]++
				if guardHistory[guardHistory[minSleptMost]] < guardHistory[m] {
					guardHistory[minSleptMost] = m
				}
			}
			if guardHistory[totalMinSlept] > mostSleptRecord {
				mostSleptGurad = lastGurad
				mostSleptRecord = guardHistory[totalMinSlept]
			}
			if guardHistory[guardHistory[minSleptMost]] > mostSleptAtAMinRecord {
				mostSleptAtAMinGuard = lastGurad
				mostSleptAtAMinRecord = guardHistory[guardHistory[minSleptMost]]
			}
		}
	}
	return mostSleptGurad * history[mostSleptGurad][minSleptMost],
		mostSleptAtAMinGuard * history[mostSleptAtAMinGuard][minSleptMost]
}
