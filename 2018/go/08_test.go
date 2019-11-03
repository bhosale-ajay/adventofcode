package main

import (
	// "fmt"
	"github.com/stretchr/testify/assert"
	"strconv"
	"strings"
	"testing"
)

func Test08(t *testing.T) {
	_, tm, tvn := traverseNodes(parseTree("08-test"))
	assert.Equal(t, 138, tm, "08 T01")
	assert.Equal(t, 66, tvn, "08 T02")
	_, m, vn := traverseNodes(parseTree("08"))
	assert.Equal(t, 36307, m, "08 01")
	assert.Equal(t, 25154, vn, "08 02")
}

func traverseNodes(tree []int) ([]int, int, int) {
	childNodesCount := tree[0]
	countOfMetaDataEntries := tree[1]
	rest := tree[2:]
	sumOfMetadata := 0
	valueOfNode := 0
	valueOfChildNodes := []int{}
	for i := 0; i < childNodesCount; i++ {
		remaining, childMetadata, value := traverseNodes(rest)
		sumOfMetadata += childMetadata
		valueOfChildNodes = append(valueOfChildNodes, value)
		rest = remaining
	}
	for i := 0; i < countOfMetaDataEntries; i++ {
		if len(rest) == 0 {
			break
		}
		metadata := rest[0]
		rest = rest[1:]
		if 0 < childNodesCount {
			if metadata <= childNodesCount {
				valueOfNode = valueOfNode + valueOfChildNodes[metadata-1]
			}
		} else {
			valueOfNode = valueOfNode + metadata
		}
		sumOfMetadata = sumOfMetadata + metadata
	}
	return rest, sumOfMetadata, valueOfNode
}

func parseTree(ip string) []int {
	ns := []int{}
	for _, sn := range strings.Split(fetchInput(ip), " ") {
		i, _ := strconv.Atoi(sn)
		ns = append(ns, i)
	}
	return ns
}
