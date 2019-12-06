package main

import (
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

type object struct {
	pName string
	count int
}

type space map[string]object

func parse(ip string) space {
	s := space{}
	for _, l := range strings.Split(fetchInput(ip), "\n") {
		ps := strings.Split(l, ")")
		pn, cn := ps[0], ps[1]
		s[cn] = object{pn, 0}
	}
	return s
}

func getCount(s space, name string) int {
	obj, ok := s[name]
	if !ok {
		return 0
	}
	if obj.count == 0 {
		obj.count = 1 + getCount(s, obj.pName)
		s[name] = obj
	}
	return obj.count
}

func countDirectNIndirectOrbits(ip string) (checksum int) {
	s := parse(ip)
	for name := range s {
		checksum += getCount(s, name)
	}
	return checksum
}

func getPath(s space, from string) []string {
	r := []string{}
	p, ok := s[from]
	for ok {
		r = append(r, p.pName)
		p, ok = s[p.pName]
	}
	return r
}

func findSanta(ip string) int {
	s := parse(ip)
	yourPath := getPath(s, "YOU")
	santaPath := getPath(s, "SAN")
	ypi := len(yourPath) - 1
	spi := len(santaPath) - 1
	for 0 <= ypi && 0 <= spi {
		if yourPath[ypi] != santaPath[spi] {
			// two hops needed to cross common
			return ypi + spi + 2
		}
		ypi--
		spi--
	}
	return 0
}

func Test06(t *testing.T) {
	assert.Equal(t, 42, countDirectNIndirectOrbits("06a"), "06 1 Test 1")
	assert.Equal(t, 204521, countDirectNIndirectOrbits("06"), "06 1")
	assert.Equal(t, 4, findSanta("06b"), "06 2 Test 1")
	assert.Equal(t, 3, findSanta("06c"), "06 2 Test 2")
	assert.Equal(t, 307, findSanta("06"), "06 2")
}
