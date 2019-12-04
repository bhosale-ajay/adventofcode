package main

import (
	"github.com/stretchr/testify/assert"
	"math"
	"strings"
	"testing"
)

func Test03(t *testing.T) {
	assert.Equal(t, []int{6, 30}, findClosestIntersection("03a"), "03 Test 1")
	assert.Equal(t, []int{159, 610}, findClosestIntersection("03b"), "03 Test 2")
	assert.Equal(t, []int{135, 410}, findClosestIntersection("03c"), "03 Test 3")
	assert.Equal(t, []int{855, 11238}, findClosestIntersection("03"), "03")
}

var dir = map[string][]int{
	"U": []int{0, -1},
	"R": []int{1, 0},
	"D": []int{0, 1},
	"L": []int{-1, 0},
}

func findClosestIntersection(ip string) []int {
	md, cs := math.MaxInt64, math.MaxInt64
	grid := map[Point][]int{}
	for li, l := range strings.Split(fetchInput(ip), "\n") {
		step, x, y := 1, 0, 0
		for _, sp := range strings.Split(l, ",") {
			d, s := sp[0:1], parseNumber(sp[1:])
			for i := 0; i < s; i++ {
				x = x + dir[d][0]
				y = y + dir[d][1]
				p := Point{x, y}
				stepsToReach, ok := grid[p]
				if !ok {
					stepsToReach = []int{0, 0}
					grid[p] = stepsToReach
				}
				if stepsToReach[li] == 0 {
					stepsToReach[li] = step
					if stepsToReach[0] > 0 && stepsToReach[1] > 0 {
						md = min(md, mdFromCenter(x, y))
						cs = min(cs, stepsToReach[0]+stepsToReach[1])
					}
				}
				step = step + 1
			}
		}
	}
	return []int{md, cs}
}
