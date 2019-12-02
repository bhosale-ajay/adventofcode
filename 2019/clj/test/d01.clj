(ns d01
  (:require [clojure.test :refer [deftest testing is]]))

(def data (slurp "../inputs/01.txt"))

(def input (map #(Integer/parseInt %) (clojure.string/split-lines data)))

(defn calFuel
  [m]
  (max 0 (- (int (Math/floor (/ m 3))) 2)))

(defn calFuelRecur
  [m]
  (let [f (calFuel m)]
    (if (<= f 0)
      0
      (+ f (calFuelRecur f)))))

; ->> is the "thread-last" macro.
; It evaluates one form and passes it as 
; the last argument into the next form.
(defn solve
  [ms f]
  (->> ms
       (map f)
       (reduce +)))

(deftest part-1
  (testing "Day 01 01"
    (is (= 3334297 (solve input calFuel)))))

(deftest part-2
  (testing "Day 01 02"
    (is (= 4998565 (solve input calFuelRecur)))))
