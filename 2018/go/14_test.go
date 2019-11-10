package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"regexp"
	"strconv"
	"strings"
	"testing"
)

func Test14(t *testing.T) {
	assert.Equal(t, "5158916779", findScore(9), "14 01 Test 01")
	assert.Equal(t, "0124515891", findScore(5), "14 01 Test 01")
	assert.Equal(t, "9251071085", findScore(18), "14 01 Test 03")
	assert.Equal(t, "5941429882", findScore(2018), "14 01 Test 04")
	assert.Equal(t, "6985103122", findScore(380621), "14 01")
	assert.Equal(t, 9, findRecipesToSequence("51589"), "14 02 Test 01")
	assert.Equal(t, 5, findRecipesToSequence("01245"), "14 02 Test 02")
	assert.Equal(t, 18, findRecipesToSequence("92510"), "14 02 Test 03")
	assert.Equal(t, 2018, findRecipesToSequence("59414"), "14 02 Test 04")
	assert.Equal(t, 20182290, findRecipesToSequence("380621"), "14 02")
}

func findScore(it int) string {
	recipeBoard := []int{3, 7}
	firstElf := 0
	secondElf := 1
	for len(recipeBoard) < it+10 {
		firstElfRecipe := recipeBoard[firstElf]
		secondElfRecipe := recipeBoard[secondElf]
		newRecipe := firstElfRecipe + secondElfRecipe
		if newRecipe > 9 {
			recipeBoard = append(recipeBoard, 1, newRecipe-10)
		} else {
			recipeBoard = append(recipeBoard, newRecipe)
		}
		firstElf = (firstElf + firstElfRecipe + 1) % len(recipeBoard)
		secondElf = (secondElf + secondElfRecipe + 1) % len(recipeBoard)
	}
	re := regexp.MustCompile(`[\[\] ]`)
	return re.ReplaceAllString(fmt.Sprintf("%v", recipeBoard[it:it+10]), "")
}

func findRecipesToSequence(sequence string) int {
	recipeBoard := []int{3, 7}
	firstElf := 0
	secondElf := 1
	last := ""
	for true {
		firstElfRecipe := recipeBoard[firstElf]
		secondElfRecipe := recipeBoard[secondElf]
		newRecipe := firstElfRecipe + secondElfRecipe
		if newRecipe > 9 {
			recipeBoard = append(recipeBoard, 1, newRecipe-10)
		} else {
			recipeBoard = append(recipeBoard, newRecipe)
		}
		firstElf = (firstElf + firstElfRecipe + 1) % len(recipeBoard)
		secondElf = (secondElf + secondElfRecipe + 1) % len(recipeBoard)

		last = last + strconv.Itoa(newRecipe)
		foundIndex := strings.Index(last, sequence)
		if foundIndex > -1 {
			return len(recipeBoard) - len(last) + foundIndex
		} else if len(last) > len(sequence) {
			last = last[len(last)-len(sequence):]
		}
	}
	return -1
}
