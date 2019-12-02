package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test01(t *testing.T) {
	ip := fetchNumbers("01")
	assert.Equal(t, 3334297, calFuel(ip), "01 01")
	assert.Equal(t, 4998565, calFuelForFuel(ip), "01 02")
}

func calFuel(ms []int) (fn int) {
	for _, m := range ms {
		fn = fn + (m / 3) - 2
	}
	return
}

func calFuelForFuel(ms []int) (fn int) {
	for _, m := range ms {
		for m > 8 {
			m = (m / 3) - 2
			fn = fn + m
		}
	}
	return
}
