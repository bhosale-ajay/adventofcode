package main

import (
	"github.com/stretchr/testify/assert"
	"strconv"
	"testing"
)

func Test04(t *testing.T) {
	assert.Equal(t, []int{1154, 750}, countValidPasswords(240920, 789857), "04")
}

func countValidPasswords(from int, to int) []int {
	p1, p2 := 0, 0

outer:
	for i := from; i <= to; i++ {
		last, doublecount, count, repeats := '0', 0, 0, false
		for _, c := range strconv.Itoa(i) {
			if last > c {
				continue outer
			}
			if last == c {
				repeats = true
				count++
				if count == 1 {
					doublecount++
				} else if count == 2 {
					doublecount--
				}
			} else {
				count = 0
			}
			last = c
		}
		if repeats {
			p1++
		}
		if doublecount > 0 {
			p2++
		}
	}
	return []int{p1, p2}
}
