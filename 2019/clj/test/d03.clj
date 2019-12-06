(ns d03 (:require [clojure.test :refer [deftest testing is]]))

(def dir (hash-map \U [0 -1] \R [1 0] \D [0 1] \L [-1 0]))

(defn calmd [x y] (+ (Math/abs x) (Math/abs y)))

(defn extractpoints
  [[olist ox oy ostep] {:keys [d s]}]
  (let [dix (get (dir d) 0) diy (get (dir d) 1)]
    (loop [i 1 list olist step ostep x ox y oy]
      (if (> i s)
        [list x y step]
        (let [nx (+ x dix)
              ny (+ y diy)]
          (recur
           (+ i 1)
           (conj list [nx ny step])
           (+ step 1)
           nx
           ny))))))

(defn parsewire
  [w]
  (->> w
       (#(clojure.string/split % #","))
       (map (fn [sd] {:d (first sd) :s (Integer/parseInt (subs sd 1))}))
       (reduce extractpoints [(vector) 0 0 1])
       (first)))

(defn parsewires
  [fname]
  (->> (str "../inputs/" fname ".txt")
       (slurp)
       (clojure.string/split-lines)
       (map parsewire)
       (into [])))

(defn getfirstwirepoints
  [fw [x y s]]
  (if (contains? fw [x y])
    fw
    (assoc fw [x y] s)))

(defn findintersection
  [[md cs fw] [x y s]]
  (let [s1 (fw [x y])]
    (if (nil? s1)
      [md cs fw]
      [(min md (calmd x y)) (min cs (+ s s1)) fw])))

(defn solve
  [fname]
  (let
   [wires (parsewires fname)
    fwp (reduce getfirstwirepoints {} (first wires))]
    (->> (second wires)
         (reduce findintersection [Integer/MAX_VALUE Integer/MAX_VALUE fwp])
         (take 2))))

(deftest part-1
  (testing "Day 03 Test 1" (is (= [6, 30] (solve "03a"))))
  (testing "Day 03 Test 2" (is (= [159, 610] (solve "03b"))))
  (testing "Day 03 Test 3" (is (= [135, 410] (solve "03c"))))
  (testing "Day 03" (is (= [855, 11238] (solve "03")))))
