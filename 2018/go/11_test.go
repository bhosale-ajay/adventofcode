package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test11(t *testing.T) {
	assert.Equal(t, "33,45,3", findLargestPowerCell(18, 3, 3), "11 01 Test")
	assert.Equal(t, "21,61,3", findLargestPowerCell(42, 3, 3), "11 01")
	assert.Equal(t, "21,22,3", findLargestPowerCell(7511, 3, 3), "11 02 Test")
	assert.Equal(t, "235,288,13", findLargestPowerCell(7511, 12, 14), "11 02")
}

const gridSize = 300

func buildGrid(serialNumber int) [][]int {
	grid := makeIntGrid(gridSize+1, gridSize+1, 0)
	for y := 1; y <= gridSize; y++ {
		for x := 1; x <= gridSize; x++ {
			rackID := x + 10
			powerLevel := (((((rackID * y) + serialNumber) * rackID) / 100) % 10) - 5
			grid[y][x] = powerLevel + grid[y][x-1] + grid[y-1][x] - grid[y-1][x-1]
		}
	}
	return grid
}

func findLargestPowerCell(serialNumber int, fromSize int, toSize int) string {
	cellWithMostPower := ""
	maxPower := 0
	grid := buildGrid(serialNumber)
	for sizeCounter := fromSize; sizeCounter <= toSize; sizeCounter++ {
		sizeFactor := sizeCounter - 1
		for y := 1; y <= gridSize-sizeFactor; y++ {
			for x := 1; x <= gridSize-sizeFactor; x++ {
				cellPower := grid[y-1][x-1] - grid[y+sizeFactor][x-1] - grid[y-1][x+sizeFactor] + grid[y+sizeFactor][x+sizeFactor]
				if cellPower > maxPower {
					maxPower = cellPower
					cellWithMostPower = fmt.Sprintf("%d,%d,%d", x, y, sizeCounter)
				}
			}
		}
	}
	return cellWithMostPower
}
