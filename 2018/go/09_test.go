package main

import (
	"container/ring"
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test09(t *testing.T) {
	assert.Equal(t, 32, playMarbles(9, 25), "09 01 T01")
	assert.Equal(t, 8317, playMarbles(10, 1618), "09 01 T02")
	assert.Equal(t, 146373, playMarbles(13, 7999), "09 01 T03")
	assert.Equal(t, 2764, playMarbles(17, 1104), "09 01 T04")
	assert.Equal(t, 54718, playMarbles(21, 6111), "09 01 T05")
	assert.Equal(t, 37305, playMarbles(30, 5807), "09 01 T06")
	assert.Equal(t, 375414, playMarbles(459, 71320), "09 01")
	assert.Equal(t, 3168033673, playMarblesWF(459, 71320, 100), "09 02")
}

func playMarbles(numberOfPlayers int, marbles int) int {
	return playMarblesWF(numberOfPlayers, marbles, 1)
}

func playMarblesWF(numberOfPlayers int, marbles int, factor int) (ms int) {
	r := ring.New(1)
	r.Value = 0
	ps := make([]int, numberOfPlayers)
	bonus := 0
	for cp, m := 0, 1; m <= marbles*factor; cp, m = cp+1, m+1 {
		if cp == numberOfPlayers {
			cp = 0
		}
		if m%23 == 0 {
			r, bonus = captureBonus(r)
			ps[cp] = ps[cp] + m + bonus
		} else {
			r = appendAfterNext(r, m)
		}
		// printRing(r)
	}
	for i, e := range ps {
		if ms < e || i == 0 {
			ms = e
		}
	}
	return
}

func appendAfterNext(r *ring.Ring, i int) *ring.Ring {
	nr := ring.New(1)
	nr.Value = i
	r.Next().Link(nr)
	return nr
}

func captureBonus(r *ring.Ring) (*ring.Ring, int) {
	r = r.Move(-7)
	bonus := r.Value.(int)
	r = r.Prev()
	r.Unlink(1)
	return r.Next(), bonus
}

func printRing(r *ring.Ring) {
	crossedZero := false
	afterZero := ""
	beforeZero := ""
	for j := 0; j < r.Len(); j++ {
		v := r.Value.(int)
		if v == 0 {
			crossedZero = true
		}
		if crossedZero {
			afterZero = fmt.Sprintf("%s%d ", afterZero, v)
		} else {
			beforeZero = fmt.Sprintf("%s%d ", beforeZero, v)
		}
		r = r.Next()
	}
	fmt.Printf("%s%s\n", afterZero, beforeZero)
}
