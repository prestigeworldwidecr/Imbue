// pathfinding.js

/*
Date			Person	Desc
2024-02-29  	CSAIZ	Created this script

***********
Description
***********

Problem Statement
Mrs. Qiu is planning to practice orienteering. The area where she'll practice is a rectangular field divided into unit squares. You are given its description as a String[] field. Each character in field is '.' (a period), '*' (an asterisk), or '#' (a number sign). Each '.' represents a passable square without a checkpoint, each '*' represents a passable square with a checkpoint, and each '#' represents an impassable obstacle. It is guaranteed that all passable squares (i.e., all '.'s and '*'s) form a 4-connected tree (see notes for formal definition). The number of checkpoints is at most 300. 

In order to practice, Mrs. Qiu chooses K of the checkpoints uniformly at random. Afterwards, she will find the shortest sequence of squares that passes through all chosen checkpoints. The sequence can start at any square, end at any square (possibly other than the starting one), and visit each square any number of times. Each pair of consecutive squares in the sequence must have a common side. The length of the sequence is the number of moves Mrs. Qiu will have to make. (So, for example, a sequence that consists of 7 squares has length 6.) 

You are given the String[] field and the int K. Return the expected length of Mrs. Qiu’s sequence.

Definition
Method signature:	def expected_length(field: List[str], K: int) -> float

Notes
-	A set S of squares is said to form a 4-connected tree if for any two squares A and B from S, there exists exactly one way to walk from A to B while visiting only the squares from S and not visiting the same square more than once. From a given square, it is possible to walk into any square that shares a common side with it.
Constraints
-	field will contain between 1 and 50 elements, inclusive.
-	Each element of field will contain between 1 and 50 characters, inclusive.
-	Each element of field will contain the same number of characters.
-	Each character in field will be '*', '.', or '#'.
-	'*' and '.' form a 4-connected tree.
-	K will be between 2 and 300, inclusive.
-	field will contain between K and 300 '*', inclusive.

Examples

Example #1:
field = [
 "*#..#",
 ".#*#.",
 "*...*"]
K = 2
Returns: 3.8333333333333353

Explanation:
Let (i,j) be the square represented by the j-th character of the i-th element of field (both numbers are 0-based). 

If she chooses (0,0) and (1,2), one of the optimal sequences is (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2) -> (1,2).
If she chooses (0,0) and (2,0), one of the optimal sequences is (0,0) -> (1,0) -> (2,0).
If she chooses (0,0) and (2,4), one of the optimal sequences is (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2) -> (2,3) -> (2,4).
If she chooses (1,2) and (2,0), one of the optimal sequences is (1,2) -> (2,2) -> (2,1) -> (2,0).
If she chooses (1,2) and (2,4), one of the optimal sequences is (1,2) -> (2,2) -> (2,3) -> (2,4).
If she chooses (2,0) and (2,4), one of the optimal sequences is (2,0) -> (2,1) -> (2,2) -> (2,3) -> (2,4).
If she chooses (0,0), (1,2), and (2,4)
So the expected length of her sequences is:
  (5 + 2 + 6 + 3 + 3 + 4) / 6 = 23 / 6 = 3.8333333333333353


Example #2:
field = [
 "*#..#",
 ".#*#.",
 "*...*"]
K = 4
Returns: 8.0

Explanation:
Mrs. Qiu chooses all four checkpoints. One of the shortest sequences is (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2) -> (1,2) -> (2,2) -> (2,3) -> (2,4).


Example #3:
field = [
 "#.#**",
 "....#",
 "#*#**",
 "**#*#",
 "#..##",
 "*#..#",
 ".#.#.",
 "....*"]
K = 3
Returns: 10.825000000000024


Example #4:
field = [    	
 "###################",
 "#*###############*#",
 "#.....#######.....#",
 "#*###*.#.*.#.*###*#",
 "#*####*.*#*.*####*#",
 "#*#####*###*#####*#",
 "###################"]
K = 9
Returns: 30.272233648704244


Example #5:
field = [    	
 "**##*.**#..#.*...*#...*#..#.##..#..#.#*...#.##*##.",
 ".#..###..#..#.#.##..#.#.*#.*..#..#.#*..##.#*...*..",
 "..#.....###.#*.##..#.#.#*..#.#..#....#..#...#*####",
 ".#.##*#.*#..#*#*.#.#...*.#.*#.#.##.#*.##.#.#..*...",
 "..*.*#*.###.#..#.#..##.##.*#..#.....#.....#..#.#.#",
 ".#.##.#..##..*#..#.#...#*##*#*..#.#.#.#.##.##.#.#*",
 "..##....#..#.#*#...*.##...#.#.####...#.#*.....#...",
 ".#.*#.##.*#*.#*.#.#.#..#.#..#.#*#.###..##.##.#.##*",
 ".*.#*..*.#.#...#.*##.#.**.#.*...**..*#..#.#.#*.#..",
 ".#*.#*##....##.#.#*..*.###.#.##.##.#.#.#....#.#*.#",
 "*.#..#*#.#*#*....#.#.#..*#**...##.#.#.**#*##.*.#..",
 ".#*.##..##..##.#.#..#.#.###.###...#...#*#..##*#.#.",
 "#..#*.#..*.###..#.#...#.###.#.#*#.#.#**##.#...*.#*",
 "..#..#.#.##.#..#.**.##*#.#**.**..#.#..#...#.##*#..",
 ".#*#.#.*..#.*#...#.#...#...#.##.#..*#*.##*....###.",
 ".*.#.#.#.#*#..*##.**.##*##..#.*#.#*###..*.#.##.#..",
 ".#......#...#.#.*#.#.#..#..#.#*#....#*.#*#.*#..*.#",
 "#..####..#*#...#*.#..#.###...#.#.#.###*#..##*##.#.",
 ".#.*..#.#...#.#..#.##...#..#.#.#.#.###..##..*.*.*.",
 ".#.#.#.#..##.*..#.*.#.##.#..##*...#.#..#.#.##.#.##",
 ".#..#*.#.#..#.##..##..#.*..#.*#.#...##....#...###.",
 ".#.#.#.#*.#.#..#.#..#..#.#.*#...#.##...#.##.##.*..",
 ".#...#.#.##.#.#..*#.*#..###..#.#.#*###.##...#*.##.",
 ".#.##.*.......*.#.*#.#.#*###..*...*..#.*.##.#.#..#",
 "...###*####*#.#..##*...#..#..##.#.#.#..##*#*.*.*#.",
 "#.#.#....*#..#.#.#.#.##..#*.#...#..#.#*#...#.##.*.",
 "..*.#*##.#.#*#.###...#..##.#.#.#*###*#.*#.#.*###.#",
 "##*##..##...#.....##.#.#.**#..#*.....##.#..#*.#.*.",
 ".....#.*.##..##.##*.*#...#.#.#.##.#*#.**..#..#.#.#",
 "##.#.#*##.#.#.*.*.#.#*#.#.#....*...#*##*##.#....#.",
 "*.**#**....*..##.#*.*.**..##.###.##.....##...##.**",
 "#.####.##*#*##..#.*#*#.##*...#.##..#.##....#*..##.",
 "....#...##.#...#*.#..##.##.#*..*.#....##.#.*##...#",
 "#.#..*##*..#.#..#..#..#*....#.##..##.#*##.##.*##..",
 "..#.#*.*.##.#.#*#.#*##.###.##...#............#*.#.",
 "#.#.##.#....*....*..##..*#.#.#.###.#.#.#.###..#..#",
 ".#**..#*#.#*#*#.#.#...*##....##.#*..#..#*..*#..#..",
 "...#*#.....#..#.#..#*#.*##.#..#.#.##..#.*#*#.#...#",
 ".#*.###.#.#.#.#.*#*##.##..#.#*..#...#.#.#..#*.*#..",
 "#*.#.#.#..#..#..#....*#.*##..##.#.#..#...##.#.#..#",
 "*.#..#..#...#..##.#*#..#.#*#.#.#.###..#.#*...#.#..",
 "#...#.#...#.#.#..#.*.#*.....**.*..#*##.#*.##....##",
 "#*#....#*#..#.*.###*#..#*##.##.#.#...#.*.##.##.##.",
 "..##*##*..#*#.#..#*.*##*.##.#...#.#.#.#.#..*#.##..",
 "#...#*##.#*#**.##.*#.*.##..*.#*#**....#**##...*.*#",
 "*#.##......*#.##.#.#.##**.#.#.#.#.#.##..#...#*#*#*",
 "*....##.#.#..#.....#..##.#....*....#.#.##.#.#.##**",
 "#.##*#...#..#.#.##..#..##.##.##.##........##.#*#.#",
 "..#...#.#*#*..*#..*#.*#.#......##.#.#.#*#..#..****",
 ".###.#..#...#.#..#..#.#...#.#.#...**.#..*#*.*##*#."]
K = 150
Returns: 1309.4951033725558

*/

// nextCheckpoint
function nextCheckpoint(field, sit)
{
    let rowLength = field.length;
    let columnLength = field [0].length;
    let tmp = -1;
    let startX = sit[0];
    let startY = sit[1];
    let pos = [-1, -1]; // x, y position of nextCheckpoint

    // console.log("rowLength: ", rowLength, " columnLength: ", columnLength, " startX: ", startX, " startY: ", startY, " pos: ", pos, " sit: ", sit);
    
    for (let i = startX; i < rowLength; i++)
    {
        for (let j = startY + 1; j < columnLength; j++)
        {
            tmp = field [i][j];
            
            if (tmp == "*")
            {
                pos [0] = i;
                pos [1] = j;

                return pos;
            }

            else
            {
                //
            }
        }
    }

    return pos;
    
}

// shortestDistanceCheckpoints

// structural dynamics of flow
// Patriot (https://www.rottentomatoes.com/tv/patriot) move object from point A --> B
function moveAtoB(field, sit, nextCheckpoint)
{
    let token = [-1, -1];  // current supposed position
    
    // try move right
    if (canMoveRight(field, sit))
    {
        token = moveRight(field, sit);
    }

    else
    {
        // Hall and Oates "No Can Do"
    }


    // down
    if (canMoveDown(field, sit))
    {
        token = moveDown(field, sit);
    }

    else
    {
        // 
    }

    // left
    if (canMoveLeft(field, sit))
    {
        token = moveLeft(field, sit);
    }

    else
    {
        // 
    }

    // up
    if (canMoveUp(field, sit))
    {
        token = moveUp(field, sit);
    }

    else
    {
        // 
    }

    console.log(token);

}

function moveLeft(field, sit)
{
    pos = [-1, -1];
    posX = sit[0];
    posY = sit[1];

    posY = posY - 1;
    pos[0] = posX;
    pos[1] = posY;

    return pos;
}

function moveRight(field, sit)
{
    pos = [-1, -1];
    posX = sit[0];
    posY = sit[1];

    posY = posY + 1;
    pos[0] = posX;
    pos[1] = posY;

    return pos;
}

function moveUp(field, sit)
{
    pos = [-1, -1];
    posX = sit[0];
    posY = sit[1];

    posX = posX - 1;
    pos[0] = posX;
    pos[1] = posY;

    return pos;
}

function moveDown(field, sit)
{
    pos = [-1, -1];
    posX = sit[0];
    posY = sit[1];

    posX = posX + 1;
    pos[0] = posX;
    pos[1] = posY;

    return pos;
}

function canMoveLeft(field, sit)
{
    let i = 0;
    let j = 0;
    let left = false;
    let tmp = "";

    // move left
    // [i] [j - 1]
    if (j - 1 >= 0)
    {
        tmp = field [i][j - 1];
        
        if (tmp != "#")
        {
            left = true;
        }

        else
        {
            left = false;
        }
    }

    else
    {
        left = false;
    }

    return false;
}

function canMoveRight(field, sit)
{
    let i = 0;
    let j = 0;
    let right = false;
    let tmp = "";

    // move right
    // [i] [j + 1]
    if (j + 1 < field[0].length)
    {
        tmp = field [i][j + 1];
        
        if (tmp != "#")
        {
            left = true;
        }

        else
        {
            left = false;
        }
    }

    else
    {
        right = false;
    }
}

function canMoveUp(field, sit)
{
    let i = 0;
    let j = 0;
    let up = false;   
    let tmp = "";

    // move up
    // [i - 1] [j]
    if (i - 1 >= 0)
    {
        tmp = field [i - 1][j];
        
        if (tmp != "#")
        {
            left = true;
        }

        else
        {
            left = false;
        }
    }

    else
    {
        up = false;
    }
}

function canMoveDown(field, sit)
{
    let i = 0;
    let j = 0;
    let down = false;
    let tmp = "";

    // move down
    // [i + 1] [j]
    if (i + 1 < field.length)
    {
        tmp = field [i + 1][j];
        
        if (tmp != "#")
        {
            left = true;
        }

        else
        {
            left = false;
        }
    }

    else
    {
        down = false;
    }

    return down;
}

function solution(field, k)
{
    let result = -1.0;
    
    return result;
}

let field = ["*#..#",
             ".#*#.",
             "*...*"];

let k = 2;
let sit = [0, 0];
// solution(field, k);

console.log(moveAtoB(field, sit, nextCheckpoint(field, sit)));

/*

********
BONEYARD
********

STRAT
-----

1 movement trace
    what makes optimal traversal, use standard traversal map?
    find path, even is suboptimal?

2 start point **IS** checkpoint
    only have to hit **k** checkpoints

3 mirrored/parallel map tracking movements, w/in one move go back twice, remove path attempt
    can also mark * as something else 'M'

4 along traversal, sum length movements/moves

5 divide length / moves = expected length

NOTES
-----
first go, simple since starting from 0, 0

// isPossibleMove
function isPossibleMove(field, sit)
{
    let i = 0;
    let j = 0;
    let left = false;
    let right = false;
    let up = false;
    let down = false;
    
    // move left
    // [i] [j - 1]
    if (j - 1 >= 0)
    {

    }

    else
    {
        left = false;
    }

    // move right
    // [i] [j + 1]
    if (j + 1 < field[0].length)
    {

    }

    else
    {
        right = false;
    }

    // move up
    // [i - 1] [j]
    if (i - 1 >= 0)
    {

    }

    else
    {
        up = false;
    }

    // move down
    // [i + 1] [j]
    if (i + 1 < field.length)
    {

    }

    else
    {
        down = false;
    }

}

*/
