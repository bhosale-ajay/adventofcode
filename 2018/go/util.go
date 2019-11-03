package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
)

func main() {
	// empty
}

func fetchInput(day string) string {
	content, err := ioutil.ReadFile(fmt.Sprintf("../inputs/%s.txt", day))
	if err != nil {
		log.Fatal(err)
	}
	return strings.ReplaceAll(string(content), "\r", "")
}

func parseNumber(s string) int {
	i, err := strconv.Atoi(s)
	if err == nil {
		return i
	}
	return 0
}

// Point struct
type Point struct {
	x, y int
}

func manhattanDistance(fx int, fy int, tx int, ty int) int {
	x := fx - tx
	if x < 0 {
		x *= -1
	}
	y := fy - ty
	if y < 0 {
		y *= -1
	}
	return x + y
}

func min(a int, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a int, b int) int {
	if a > b {
		return a
	}
	return b
}

func makeIntGrid(height int, width int, defaultValue int) [][]int {
	result := make([][]int, height)
	for y := 0; y < height; y++ {
		result[y] = make([]int, width)
		for x := 0; x < width; x++ {
			result[y][x] = defaultValue
		}
	}
	return result
}

func makeStringGrid(height int, width int, defaultValue string) [][]string {
	result := make([][]string, height)
	for y := 0; y < height; y++ {
		result[y] = make([]string, width)
		for x := 0; x < width; x++ {
			result[y][x] = defaultValue
		}
	}
	return result
}
