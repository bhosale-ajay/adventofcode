package main

import (
	// "fmt"
	"github.com/stretchr/testify/assert"
	"regexp"
	"sort"
	"testing"
)

func Test07(t *testing.T) {
	assert.Equal(t, "CABDFE", determineOrder("07-test"), "07 01 T01")
	assert.Equal(t, "BDHNEGOLQASVWYPXUMZJIKRTFC", determineOrder("07"), "07 01")
	assert.Equal(t, 15, findTimeToComplete("07-test", 2, 0), "07 02 T01")
	assert.Equal(t, 1107, findTimeToComplete("07", 5, 60), "07 02")
}

type status int

const (
	PROCESSING status = iota
	WAITING
)

type step struct {
	name      string
	dependsOn int
	children  []string
	status    status
	cost      int
}

func createStep(name string, base int) (step step) {
	step.name = name
	step.children = []string{}
	step.dependsOn = 0
	step.cost = base + int(name[0]) - 64
	step.status = WAITING
	return
}

func parseNodes(ip string, base int) map[string]step {
	re := regexp.MustCompile(`(?m)Step (\w) must be finished before step (\w) can begin.`)
	steps := map[string]step{}
	for _, m := range re.FindAllStringSubmatch(fetchInput(ip), -1) {
		pn, cn := m[1], m[2]
		ps, ok := steps[pn]
		if !ok {
			ps = createStep(pn, base)
		}
		cs, ok := steps[cn]
		if !ok {
			cs = createStep(cn, base)
		}
		ps.children = append(ps.children, cn)
		cs.dependsOn++
		cs.status = WAITING
		// struct in map are returned by value and not by ref
		steps[pn] = ps
		steps[cn] = cs
	}
	return steps
}

func getSeedQueue(steps map[string]step) []string {
	queue := []string{}
	for _, s := range steps {
		if s.dependsOn == 0 {
			queue = append(queue, s.name)
		}
	}
	return queue
}

func findTimeToComplete(ip string, wc int, base int) (ttc int) {
	steps := parseNodes(ip, base)
	queue := getSeedQueue(steps)
	for len(queue) > 0 {
		sort.Slice(queue, func(i, j int) bool {
			si := steps[queue[i]]
			sj := steps[queue[j]]
			if si.status == sj.status {
				return si.name < sj.name
			}
			return si.status < sj.status
		})
		for qi := min(wc, len(queue)) - 1; 0 <= qi; qi-- {
			s := steps[queue[qi]]
			s.status = PROCESSING
			s.cost--
			steps[queue[qi]] = s
			if s.cost == 0 {
				// drop the step
				queue = append(queue[:qi], queue[qi+1:]...)
				for _, cn := range s.children {
					cs := steps[cn]
					cs.dependsOn--
					if cs.dependsOn == 0 {
						queue = append(queue, cn)
					}
					steps[cn] = cs
				}
			}
		}
		ttc++
	}
	return
}

func determineOrder(ip string) (order string) {
	steps := parseNodes(ip, 0)
	queue := getSeedQueue(steps)
	for len(queue) > 0 {
		sort.Strings(queue)
		// does not work as queue on left side act as new scope
		// sn, queue := queue[0], queue[1:]
		sn := queue[0]
		queue = queue[1:]
		order = order + string(sn)
		s := steps[sn]
		for _, cn := range s.children {
			cs := steps[cn]
			cs.dependsOn--
			if cs.dependsOn == 0 {
				queue = append(queue, cn)
			}
			steps[cn] = cs
		}
	}
	return
}
