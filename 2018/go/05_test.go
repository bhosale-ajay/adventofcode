package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test05(t *testing.T) {
	pi := fetchInput("05")
	assert.Equal(t, 10, react("dabAcCaCBAcCcaDA"), "05 01 T01")
	assert.Equal(t, 0, react("aA"), "05 01 T02")
	assert.Equal(t, 0, react("abBA"), "05 01 T03")
	assert.Equal(t, 4, react("abAB"), "05 01 T04")
	assert.Equal(t, 6, react("aabAAB"), "05 01 T05")
	assert.Equal(t, 9808, react(pi), "05 01")
	assert.Equal(t, 4, findOptimalSolution("dabAcCaCBAcCcaDA"), "05 02 T01")
	assert.Equal(t, 6484, findOptimalSolution(pi), "05 02")
}

func react(units string) int {
	return reducePolymer(units, 0)
}

func findOptimalSolution(units string) int {
	ol := len(units)
	for _, ic := range "abcdefghijklmnopqrstuvwxyz" {
		l := reducePolymer(units, ic)
		if l < ol {
			ol = l
		}
	}
	return ol
}

func reducePolymer(units string, ignore rune) int {
	stack := []rune{}
	for _, u := range units {
		if ignore > 0 && (u == ignore || u == ignore-32) {
			continue
		}
		li := len(stack) - 1
		if li >= 0 {
			lu := stack[li]
			if u == lu+32 || u == lu-32 {
				stack = stack[:li]
			} else {
				stack = append(stack, u)
			}
		} else {
			stack = append(stack, u)
		}
	}
	return len(stack)
}
