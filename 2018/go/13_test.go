package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"sort"
	"strings"
	"testing"
)

type turn int

const (
	LEFT turn = iota
	STRAIGHT
	RIGHT
)

type direction int

const (
	NORTH direction = iota
	EAST
	WEST
	SOUTH
)

type impact struct {
	xi int
	yi int
	d  direction
}

type cart struct {
	x       int
	y       int
	it      turn
	f       direction
	crashed bool
}

func Test13(t *testing.T) {
	assert.Equal(t, "7,3 ", runSimulation("13-test1"), "13 Test 01")
	assert.Equal(t, "2,0 6,4", runSimulation("13-test2"), "13 Test 02")
	assert.Equal(t, "26,99 62,48", runSimulation("13"), "13")
}

func createImpact(xi int, yi int, d direction) (i impact) {
	i.xi = xi
	i.yi = yi
	i.d = d
	return
}

func directionImpact(left impact, straight impact, right impact) map[turn]impact {
	return map[turn]impact{
		LEFT:     left,
		STRAIGHT: straight,
		RIGHT:    right,
	}
}

func buildCart(x int, y int, facing direction) (c cart) {
	c.x = x
	c.y = y
	c.it = LEFT
	c.f = facing
	return
}

func (c *cart) move(i impact, it turn) {
	c.x = c.x + i.xi
	c.y = c.y + i.yi
	c.f = i.d
	c.it = it
}

func runSimulation(ip string) string {
	goNorth := createImpact(0, -1, NORTH)
	goEast := createImpact(1, 0, EAST)
	goWest := createImpact(-1, 0, WEST)
	goSouth := createImpact(0, 1, SOUTH)
	impacts := map[direction]map[turn]impact{
		NORTH: directionImpact(goWest, goNorth, goEast),
		EAST:  directionImpact(goNorth, goEast, goSouth),
		WEST:  directionImpact(goSouth, goWest, goNorth),
		SOUTH: directionImpact(goEast, goSouth, goWest),
	}
	cartIndicator := map[rune]direction{
		'^': NORTH,
		'>': EAST,
		'<': WEST,
		'v': SOUTH,
	}
	nextTurn := map[turn]turn{
		LEFT:     STRAIGHT,
		STRAIGHT: RIGHT,
		RIGHT:    LEFT,
	}
	lines := strings.Split(fetchInput(ip), "\n")
	carts := []cart{}
	for y, l := range lines {
		for x, r := range l {
			cd, isCart := cartIndicator[r]
			if isCart {
				carts = append(carts, buildCart(x, y, cd))
			}
		}
	}
	safeCarts := len(carts)
	firstCrash := ""
	safeCartLocation := ""
	for safeCarts > 1 {
		sort.Slice(carts, func(i, j int) bool {
			if carts[i].y == carts[j].y {
				return carts[i].x < carts[j].x
			}
			return carts[i].y < carts[j].y
		})
		for ci, _ := range carts {
			c := &carts[ci]
			if c.crashed {
				continue
			}
			t := STRAIGHT
			it := c.it
			facingNorthSouth := c.f == NORTH || c.f == SOUTH
			switch lines[c.y][c.x] {
			case '/':
				if facingNorthSouth {
					t = RIGHT
				} else {
					t = LEFT
				}
			case '\\':
				if facingNorthSouth {
					t = LEFT
				} else {
					t = RIGHT
				}
			case '+':
				t = it
				it = nextTurn[it]
			}
			c.move(impacts[c.f][t], it)
			for oci, _ := range carts {
				oc := &carts[oci]
				if oc.crashed {
					continue
				}
				if oci != ci && oc.x == c.x && oc.y == c.y {
					if firstCrash == "" {
						firstCrash = fmt.Sprintf("%d,%d", c.x, c.y)
					}
					c.crashed = true
					oc.crashed = true
					safeCarts = safeCarts - 2
					break
				}
			}
		}
	}
	if safeCarts == 1 {
		for _, c := range carts {
			if !c.crashed {
				safeCartLocation = fmt.Sprintf("%d,%d", c.x, c.y)
				break
			}
		}
	}
	return firstCrash + " " + safeCartLocation
}
