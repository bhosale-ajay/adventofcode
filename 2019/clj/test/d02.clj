(ns d02
  (:require [clojure.test :refer [deftest testing is]]))

(def input (->> "../inputs/02.txt"
                (slurp)
                (#(clojure.string/split % #","))
                (map #(Integer/parseInt %))
                (vec)))

(defn setnounandverb
  [n v]
  (assoc (assoc input 1 n) 2 v))

(defn execute
  [opcode p]
  (let [a (nth p (nth opcode 1))
        b (nth p (nth opcode 2))
        l (nth opcode 3)]
    (case (first opcode)
      1 (assoc p l (+ a b))
      2 (assoc p l (* a b)))))

(defn trynounandverb
  [n v]
  (loop [i 0 p (setnounandverb n v)]
    (let [opcode (subvec p i)]
      (if (= 99 (first opcode))
        (first p)
        (recur (+ i 4) (execute opcode p))))))

(defn findnounandverbtoland
  []
  (first (for [n (range 13 99) v (range 0 99)
               :when (= 19690720 (trynounandverb n v))]
           (+ (* n 100) v))))

(deftest part-1
  (testing "Day 02 01" (is (= 10566835 (trynounandverb 12 2)))))

(deftest part-2
  (testing "Day 02 02" (is (= 2347 (findnounandverbtoland)))))