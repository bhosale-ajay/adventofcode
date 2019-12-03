package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test02(t *testing.T) {
	assert.Equal(t, 10566835, tryNounAndVerb(12, 2), "01 01")
	assert.Equal(t, 2347, findNounAndVerbToLand(), "01 01")
}

func tryNounAndVerb(noun int, verb int) int {
	p := fetchNumbersWS("02", ",")
	p[1], p[2] = noun, verb
	for ip := 0; ; ip = ip + 4 {
		opCode := p[ip]
		if opCode == 1 {
			p[p[ip+3]] = p[p[ip+1]] + p[p[ip+2]]
		} else if opCode == 2 {
			p[p[ip+3]] = p[p[ip+1]] * p[p[ip+2]]
		} else if opCode == 99 {
			return p[0]
		} else {
			return 0
		}
	}
}

func findNounAndVerbToLand() int {
	for n := 13; n <= 99; n++ {
		for v := 0; v <= 99; v++ {
			if tryNounAndVerb(n, v) == 19690720 {
				return n*100 + v
			}
		}
	}
	return 0
}
