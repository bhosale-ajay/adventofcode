package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"math"
	"strings"
	"testing"
)

type area struct {
	Point
	size   int
	onEdge bool
}

func Test06(t *testing.T) {
	tmca, tr := solveChronalCoordinates("06-test", 32)
	mca, r := solveChronalCoordinates("06", 10000)
	assert.Equal(t, 17, tmca, "06 01 T01")
	assert.Equal(t, 4976, mca, "06 01")
	assert.Equal(t, 16, tr, "06 02 T01")
	assert.Equal(t, 46462, r, "06 02")
}

func solveChronalCoordinates(ip string, dc int) (maxClosedArea int, reachable int) {
	const (
		NONE = -1
		MANY = -1
	)
	lines := strings.Split(fetchInput(ip), "\n")
	areas := make([]area, len(lines))
	var (
		minX = math.MaxInt32
		minY = math.MaxInt32
		maxX = 0
		maxY = 0
	)
	for li, l := range lines {
		a := area{}
		fmt.Sscanf(l, "%d, %d", &a.x, &a.y)
		areas[li] = a
		if minX > a.x {
			minX = a.x
		}
		if minY > a.y {
			minY = a.y
		}
		if maxX < a.x {
			maxX = a.x
		}
		if maxY < a.y {
			maxY = a.y
		}
	}
	for x := minX; x <= maxX; x++ {
		for y := minY; y <= maxY; y++ {
			var (
				td      = 0
				cd      = math.MaxInt32
				closeTo = NONE
			)
			for ai, a := range areas {
				d := manhattanDistance(x, y, a.x, a.y)
				td = td + d
				if d < cd {
					cd = d
					closeTo = ai
				} else if d == cd {
					closeTo = MANY
				}
			}
			if closeTo != MANY {
				areas[closeTo].size = areas[closeTo].size + 1
				onEdge := x == minX || y == minY || x == maxX || y == maxY
				areas[closeTo].onEdge = areas[closeTo].onEdge || onEdge
			}
			if td < dc {
				reachable = reachable + 1
			}
		}
	}
	for _, a := range areas {
		if !a.onEdge && a.size > maxClosedArea {
			maxClosedArea = a.size
		}
	}
	return
}
