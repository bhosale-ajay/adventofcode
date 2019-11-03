package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

type Light struct {
	Point
	vx int
	vy int
}

func Test10(t *testing.T) {
	assert.Equal(t, 3, simulate("10-test"), "10 02 Test")
	assert.Equal(t, 10407, simulate("10"), "10 02")
}

func simulate(ip string) int {
	lines := strings.Split(fetchInput(ip), "\n")
	lights := make([]Light, len(lines))
	leftMost := Light{}
	topMost := Light{}
	rightMost := Light{}
	bottomMost := Light{}
	for li, line := range lines {
		l := Light{}
		fmt.Sscanf(line, "position=<%d,  %d> velocity=<%d, %d>", &l.x, &l.y, &l.vx, &l.vy)
		lights[li] = l
		if li == 0 {
			leftMost = l
			topMost = l
			rightMost = l
			bottomMost = l
		} else {
			if l.x < leftMost.x {
				leftMost = l
			}
			if l.y < topMost.y {
				topMost = l
			}
			if rightMost.x < l.x {
				rightMost = l
			}
			if bottomMost.y < l.y {
				bottomMost = l
			}
		}
	}
	secondsX := findSecondsToMeet(leftMost.x, rightMost.x, leftMost.vx, rightMost.vx)
	secondsY := findSecondsToMeet(topMost.y, bottomMost.y, topMost.vy, bottomMost.vy)
	to := min(secondsX, secondsY)
	if secondsX > secondsY {
		to = secondsY
	}
	var secondsToWait int
	var lowX, highX, lowY, highY, area int
	var lastLX, lastHX, lastLY, lastHY, lastArea int
	for s := to; 0 < s && to-10 < s; s-- {
		for li, l := range lights {
			lx, ly := positionAfterN(l, s)
			if li == 0 {
				lowX = lx
				highX = lx
				lowY = ly
				highY = ly
			} else {
				lowX = min(lx, lowX)
				highX = max(lx, highX)
				lowY = min(ly, lowY)
				highY = max(ly, highY)
			}
		}
		area = (highX - lowX) * (highY - lowY)
		if lastArea != 0 && lastArea < area {
			secondsToWait = s + 1
			break
		} else {
			lastArea = area
			lastLX = lowX
			lastHX = highX
			lastLY = lowY
			lastHY = highY
		}
	}

	height := lastHY - lastLY + 1
	width := lastHX - lastLX + 1
	sky := makeStringGrid(height, width, ".")

	for _, l := range lights {
		lx, ly := positionAfterN(l, secondsToWait)
		sky[ly-lastLY][lx-lastLX] = "#"
	}

	message := ""
	for y := 0; y < height; y++ {
		message = message + strings.Join(sky[y], "") + "\n"
	}
	fmt.Println(message)

	return secondsToWait
}

func findSecondsToMeet(p1 int, p2 int, p1v int, p2v int) int {
	return (p1 - p2) / (p2v - p1v)
}

func positionAfterN(l Light, n int) (int, int) {
	return l.x + (n * l.vx), l.y + (n * l.vy)
}
