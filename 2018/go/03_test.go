package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"log"
	"strings"
	"testing"
)

type square struct {
	x, y int
}

type claim struct {
	id   int
	l, r int
	w, h int
}

func Test03(t *testing.T) {
	td, tuid := sliceIt("#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2")
	d, uid := sliceIt(fetchInput("03"))
	assert.Equal(t, 4, td, "03 01 T01")
	assert.Equal(t, 3, tuid, "03 02 T01")
	assert.Equal(t, 119572, d, "03 01")
	assert.Equal(t, 775, uid, "03 02")
}

func parseClaim(l string) (c claim) {
	sc, err := fmt.Sscanf(l, "#%d @ %d,%d: %dx%d", &c.id, &c.l, &c.r, &c.w, &c.h)
	if sc != 5 {
		log.Fatal("Could not find all claim details")
	}
	if err != nil {
		log.Fatal(err)
	}
	return
}

func sliceIt(ip string) (int, int) {
	ls := strings.Split(ip, "\n")
	fabric := map[square]int{}
	disputed := map[square]bool{}
	candidates := map[int]bool{}
	for _, l := range ls {
		c := parseClaim(l)
		candidates[c.id] = true
		for x := c.l; x < c.l+c.w; x++ {
			for y := c.r; y < c.r+c.h; y++ {
				spot := square{x, y}
				claimedBy, hasClaim := fabric[spot]
				if hasClaim {
					delete(candidates, c.id)
					delete(candidates, claimedBy)
					disputed[spot] = true
				} else {
					fabric[spot] = c.id
				}
			}
		}
	}
	var uid int
	for key := range candidates {
		uid = key
	}
	return len(disputed), uid
}
