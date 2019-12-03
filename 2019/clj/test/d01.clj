(ns d01
  (:require [clojure.test :refer [deftest testing is]]))

(def input (->> "../inputs/01.txt"
                (slurp)
                (clojure.string/split-lines)
                (map #(Integer/parseInt %))))

(defn calfuel [m] (->> m
                       (#(quot % 3))
                       (#(- % 2))
                       (max 0)))

(defn calfuelrecur
  [m]
  (let [f (calfuel m)]
    (if (<= f 0)
      0
      (+ f (calfuelrecur f)))))

(defn solve [ms f] (->> ms (map f) (reduce +)))

(deftest part-1
  (testing "Day 01 01" (is (= 3334297 (solve input calfuel)))))

(deftest part-2
  (testing "Day 01 02" (is (= 4998565 (solve input calfuelrecur)))))
