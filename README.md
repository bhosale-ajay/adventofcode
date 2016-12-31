# Advent of Code -  Solutions

2015 - JavaScript and ES6

2016 - JavaScript via TypeScript and ES6
 - Runs only with node
 - Use Gulp tasks to convert .ts code to .js
 - TypeScript targets ES6, while Babel transforms ES6 features not supported by Node.
 - Exploring 2016 solutions
   1. Open 2016 folder on command prompt
   2. Run `npm install`
   3. Open 2016 folder with Visual Studio Code
   4. Press Ctrl + Shift + B, which will run the default tasks/ Or simply run `gulp` from command prompt
   5. Compiled files are copied to "dist" folder
   6. To test a particular day from command prompt, run `node dist\{{day}}`, for example - `node dist\01`
   7. All days are written like test cases with utility method "Assert"
   8. Run.ts has references to all the days and executes them excluding day 05, day 11 (Part II), day 14 (Part II), day 16 (Part II) and day 18 (part II) 
   9. Code heavily uses functional programming, and new ES6 features like destructuring, and tuple like syntax