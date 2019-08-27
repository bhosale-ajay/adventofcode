package main

import (
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

func Test02(t *testing.T) {
	test01 := parse02("abcdef\nbababc\nabbcde\nabcccd\naabcdd\nabcdee\nababab")
	test02 := parse02("abcde\nfghij\nklmno\npqrst\nfguij\naxcye\nwvxyz")
	puzzleInput := parse02(fetchInput("02"))
	assert.Equal(t, 12, findCheckSum(test01), "02 01 T01")
	assert.Equal(t, 9633, findCheckSum(puzzleInput), "02 01")
	assert.Equal(t, "fgij", findCommonLetters(test02), "02 02 T01")
	assert.Equal(t, "lujnogabetpmsydyfcovzixaw", findCommonLetters(puzzleInput), "02 02")
}

func findCheckSum(boxIDs []string) int {
	allTwo := 0
	allThree := 0
	for _, boxID := range boxIDs {
		charCount := map[rune]int{}
		lineTwo := 0
		lineThree := 0
		for _, c := range boxID {
			charCount[c]++
			if charCount[c] == 2 {
				lineTwo++
			} else if charCount[c] == 3 {
				lineThree++
				lineTwo--
			} else if charCount[c] == 4 {
				lineThree--
			}
		}
		if lineTwo > 0 {
			allTwo++
		}
		if lineThree > 0 {
			allThree++
		}
	}
	return allTwo * allThree
}

func differByOneChar(a, b string) (bool, int) {
	mismatch := 0
	position := 0
	for i := 0; i < len(a); i++ {
		if a[i] != b[i] {
			mismatch++
			position = i
			if mismatch > 1 {
				return false, 0
			}
		}
	}
	return mismatch == 1, position
}

func findCommonLetters(boxIDs []string) string {
	for i := range boxIDs {
		for j := i + 1; j < len(boxIDs); j++ {
			d, p := differByOneChar(boxIDs[i], boxIDs[j])
			if d {
				return boxIDs[i][:p] + boxIDs[i][p+1:]
			}
		}
	}
	panic("No match found")
}

func parse02(ip string) []string {
	return strings.Split(ip, "\n")
}
