package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"math"
	"sort"
	"strings"
	"testing"
)

const (
	E    = 'E'
	G    = 'G'
	OPEN = '.'
	WALL = '#'
)

var directions = [][]int{{0, -1}, {-1, 0}, {1, 0}, {0, 1}}

type unit struct {
	x, y, power, hit int
	team, oppTeam    rune
	alive            bool
}

type cave struct {
	layout [][]rune
	units  []unit
}

func Test15(t *testing.T) {
	assert.Equal(t, []int{47, 590, 27730, 3, G}, simulateBattle("15-test1", 3, false), "15 01 Test 01")
	assert.Equal(t, []int{37, 982, 36334, 3, E}, simulateBattle("15-test2", 3, false), "15 01 Test 02")
	assert.Equal(t, []int{46, 859, 39514, 3, E}, simulateBattle("15-test3", 3, false), "15 01 Test 03")
	assert.Equal(t, []int{35, 793, 27755, 3, G}, simulateBattle("15-test4", 3, false), "15 01 Test 04")
	assert.Equal(t, []int{54, 536, 28944, 3, G}, simulateBattle("15-test5", 3, false), "15 01 Test 05")
	assert.Equal(t, []int{20, 937, 18740, 3, G}, simulateBattle("15-test6", 3, false), "15 01 Test 06")
	assert.Equal(t, []int{68, 2812, 191216, 3, G}, simulateBattle("15-test7", 3, false), "15 01 Test 07")
	assert.Equal(t, []int{102, 2592, 264384, 3, G}, simulateBattle("15-test9", 3, false), "15 01 Test 08")
	assert.Equal(t, []int{77, 2543, 195811, 3, G}, simulateBattle("15", 3, false), "15 01")

	assert.Equal(t, []int{29, 172, 4988, 15, E}, simulateBattle("15-test1", 4, true), "15 02 Test 01")
	assert.Equal(t, []int{33, 948, 31284, 4, E}, simulateBattle("15-test3", 4, true), "15 02 Test 02")
	assert.Equal(t, []int{37, 94, 3478, 15, E}, simulateBattle("15-test4", 4, true), "15 02 Test 03")
	assert.Equal(t, []int{39, 166, 6474, 12, E}, simulateBattle("15-test5", 4, true), "15 02 Test 04")
	assert.Equal(t, []int{30, 38, 1140, 34, E}, simulateBattle("15-test6", 4, true), "15 02 Test 05")
	assert.Equal(t, []int{31, 1550, 48050, 25, E}, simulateBattle("15-test7", 4, true), "15 02 Test 06")
	assert.Equal(t, []int{46, 1457, 67022, 20, E}, simulateBattle("15-test9", 4, true), "15 02 Test 07")
	assert.Equal(t, []int{63, 1109, 69867, 10, E}, simulateBattle("15", 4, true), "15 02")
}

func prepareUnit(x, y, power int, team rune) (u unit) {
	u.x = x
	u.y = y
	u.team = team
	if u.team == E {
		u.oppTeam = G
	} else {
		u.oppTeam = E
	}
	u.hit = 200
	u.power = power
	u.alive = true
	return
}

func (c *cave) getOpponents(team rune) []*unit {
	opponents := []*unit{}
	for ui := range c.units {
		u := &c.units[ui]
		if u.alive && u.oppTeam == team {
			opponents = append(opponents, u)
		}
	}
	return opponents
}

func (c *cave) orderUnits() {
	sort.Slice(c.units, func(i, j int) bool {
		if c.units[i].y == c.units[j].y {
			return c.units[i].x < c.units[j].x
		}
		return c.units[i].y < c.units[j].y
	})
}

func buildCave(ip string, elfPower int) (cave cave) {
	cave.layout = [][]rune{}
	cave.units = []unit{}
	basePower := map[rune]int{E: elfPower, G: 3}
	for y, row := range strings.Split(fetchInput(ip), "\n") {
		chars := []rune(row)
		for x, char := range chars {
			if char == E || char == G {
				unit := prepareUnit(x, y, basePower[char], char)
				cave.units = append(cave.units, unit)
			}
		}
		cave.layout = append(cave.layout, chars)
	}
	return
}

func locationKey(x, y int) string {
	return fmt.Sprintf("%d,%d", x, y)
}

func (u *unit) attack(opponents []*unit, cave cave) bool {
	nearByOpponents := []*unit{}
	for _, dir := range directions {
		nx, ny := u.x+dir[0], u.y+dir[1]
		for _, ou := range opponents {
			if ou.x == nx && ou.y == ny {
				nearByOpponents = append(nearByOpponents, ou)
			}
		}
	}
	if len(nearByOpponents) == 0 {
		return false
	}
	if len(nearByOpponents) > 1 {
		sort.Slice(nearByOpponents, func(i, j int) bool {
			return nearByOpponents[i].hit < nearByOpponents[j].hit
		})
	}
	opponent := nearByOpponents[0]
	opponent.hit = opponent.hit - u.power
	if opponent.hit < 1 {
		opponent.alive = false
		cave.layout[opponent.y][opponent.x] = OPEN
	}
	return opponent.alive == false
}

func (u *unit) moveTowardsOpponent(cave cave) {
	queue := [][]int{{u.x, u.y, u.x, u.y, 0}}
	visited := map[string]bool{
		locationKey(u.x, u.y): true,
	}
	firstStep := true
	opponents := [][]int{}
	firstOpponentFoundAt := math.MaxInt64
	current := []int{}
	for len(queue) > 0 {
		current, queue = queue[0], queue[1:]
		x, y, toX, toY, distance := current[0], current[1], current[2], current[3], current[4]
		if distance >= firstOpponentFoundAt {
			break
		}
		for _, dir := range directions {
			nx, ny := x+dir[0], y+dir[1]
			location := locationKey(nx, ny)
			content := cave.layout[ny][nx]
			if visited[location] || content == u.team || content == WALL {
				continue
			}
			if content == u.oppTeam {
				opponents = append(opponents, []int{x, y, toX, toY})
				if len(opponents) == 1 {
					firstOpponentFoundAt = distance + 1
				}
			}
			visited[location] = true
			if content == OPEN {
				nToX, nToY := toX, toY
				if firstStep {
					nToX, nToY = nx, ny
				}
				queue = append(queue, []int{nx, ny, nToX, nToY, distance + 1})
			}
		}
		firstStep = false
	}
	opponentsFound := len(opponents)
	if opponentsFound > 0 {
		if opponentsFound > 1 {
			sort.Slice(opponents, func(i, j int) bool {
				if opponents[i][1] == opponents[j][1] {
					return opponents[i][0] < opponents[j][0]
				}
				return opponents[i][1] < opponents[j][1]
			})
		}
		toX, toY := opponents[0][2], opponents[0][3]
		if toX == u.x && toY == u.y {
			return
		}
		cave.layout[u.y][u.x] = OPEN
		cave.layout[toY][toX] = u.team
		u.x, u.y = toX, toY
	}
}

func simulateBattle(ip string, elfPower int, findOptimalSolution bool) []int {
	cave := buildCave(ip, elfPower)
	roundCounter := 0

roundLoop:
	for true {
		cave.orderUnits()
		for ui := range cave.units {
			unit := &cave.units[ui]
			if !unit.alive {
				continue
			}
			opponents := cave.getOpponents(unit.team)
			if len(opponents) == 0 {
				break roundLoop
			}
			unit.moveTowardsOpponent(cave)
			oppKilled := unit.attack(opponents, cave)
			if oppKilled && unit.oppTeam == E && findOptimalSolution {
				return simulateBattle(ip, elfPower+1, findOptimalSolution)
			}
		}
		roundCounter = roundCounter + 1
	}
	sumOfUnits, winner := 0, G
	for _, u := range cave.units {
		if u.alive {
			winner = u.team
			sumOfUnits = sumOfUnits + u.hit
		}
	}
	return []int{roundCounter, sumOfUnits, roundCounter * sumOfUnits, elfPower, int(winner)}
}
