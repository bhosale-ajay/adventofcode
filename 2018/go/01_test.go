package main

import (
	"github.com/stretchr/testify/assert"
	"strconv"
	"strings"
	"testing"
)

func Test01(t *testing.T) {
	test01 := parse01("+1, +1, +1", ",")
	test02 := parse01("+1, +1, -2", ",")
	test03 := parse01("-1, -2, -3", ",")
	test04 := parse01("+1, -1", ",")
	test05 := parse01("+3, +3, +4, -2, -4", ",")
	test06 := parse01("-6, +3, +8, +5, -6", ",")
	test07 := parse01("+7, +7, -2, -7, -4", ",")
	ip := parse01(fetchInput("01"), "\n")

	assert.Equal(t, 3, findResultingFrequency(test01), "01 01 T01")
	assert.Equal(t, 0, findResultingFrequency(test02), "01 01 T02")
	assert.Equal(t, -6, findResultingFrequency(test03), "01 01 T03")
	assert.Equal(t, 466, findResultingFrequency(ip), "01 01")

	assert.Equal(t, 0, firstFrequencyReachesTwice(test04), "01 02 T01")
	assert.Equal(t, 10, firstFrequencyReachesTwice(test05), "01 02 T02")
	assert.Equal(t, 5, firstFrequencyReachesTwice(test06), "01 02 T03")
	assert.Equal(t, 14, firstFrequencyReachesTwice(test07), "01 02 T04")
	assert.Equal(t, 750, firstFrequencyReachesTwice(ip), "01 02")
}

func parse01(ip string, sep string) []int {
	lines := strings.Split(strings.TrimSpace(ip), sep)
	result := make([]int, 0, len(lines))
	for _, l := range lines {
		i, _ := strconv.Atoi(strings.TrimSpace(l))
		result = append(result, i)
	}
	return result
}

func findResultingFrequency(fs []int) int {
	sum := 0
	for _, f := range fs {
		sum = sum + f
	}
	return sum
}

func firstFrequencyReachesTwice(fs []int) int {
	history := map[int]int{0: 1}
	cf := 0
	notFound := true
	for notFound && len(fs) > 0 {
		for _, f := range fs {
			cf += f
			history[cf]++
			if history[cf] > 1 {
				notFound = false
				break
			}
		}
	}
	return cf
}
