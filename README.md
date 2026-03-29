# advent-of-code-2016

[![CI](https://github.com/jambolo/advent-of-code-2016/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/jambolo/advent-of-code-2016/actions/workflows/ci.yml)

My solutions to Advent of Code 2016 written in Typescript. The development environment is VS Code and WSL Ubuntu.

## Day 1

So far, so good.

| Part | Answer |
|------|--------|
|    1 |    299 |
|    2 |    181 |

## Day 2

For this year, I'm not going to write "Trivial" for every day. If you don't see any comments, it was trivial.

| Part | Answer |
|------|--------|
|    1 |  69642 |
|    2 |  8CB23 |

## Day 3

| Part | Answer |
|------|--------|
|    1 |   1032 |
|    2 |   1838 |

## Day 4

Gotta love method chaining for processing arrays.

| Part | Answer |
|------|--------|
|    1 | 173787 |
|    2 |    548 |

## Day 5

| Part |  Answer  |
|------|----------|
|    1 | d4cd2ee1 |
|    2 | f2c730e5 |

## Day 6

| Part |  Answer  |
|------|----------|
|    1 | kqsdmzft |
|    2 | tpooccyo |

## Day 7

Apparently, Typescript fully allocates and populates an array for each step in the code `count = x.map(...).filter(...).length;` even though only the length is used in the end. Rust does not.

| Part | Answer |
|------|--------|
|    1 |    110 |
|    2 |    242 |

## Day 8

| Part |   Answer   |
|------|------------|
|    1 |        115 |
|    2 | EFEYKFRFIJ |

*The answer to part 2 was found by inspection.*

## Day 9

I find recursion to be elegant, but otherwise annoying. Don't you?

| Part |    Answer   |
|------|-------------|
|    1 |      150914 |
|    2 | 11052855125 |

## Day 10

| Part | Answer |
|------|--------|
|    1 |    147 |
|    2 |  55637 |

## Day 11

What is AoC without puzzle that requires A*? In this A* puzzle, I couldn't think of an efficient heuristic, so I went with something basic, ensuring that it is admissible, and prayed that it would be sufficient.

I got bored reimplementing A* in yet another language, so I cheated and let Claude implement it for me.

| Part | Answer |
|------|--------|
|    1 |     33 |
|    2 |     57 |

## Day 12

Lots of messy code.

| Part |  Answer |
|------|---------|
|    1 |  318020 |
|    2 | 9227674 |

## Day 13

Part 1 was trivial because I already had A* from Day 11. The only tricky part was avoiding hard-coding the input. Part 2 took a little thought because it is completely different from Part 1, but it turned out to be pretty easy, too.

| Part | Answer |
|------|--------|
|    1 |     96 |
|    2 |    141 |

## Day 14

Very straightforward. Caching is the key.

| Part | Answer |
|------|--------|
|    1 |  35186 |
|    2 |  22429 |

## Day 15

Classic Chinese Remainder Theorem. The numbers are small, so I solved it with a sieve. I didn't want to spend time trying to understand how to implement the more efficient method.

| Part |  Answer |
|------|---------|
|    1 |  122318 |
|    2 | 3208583 |

## Day 16

| Part |      Answer       |
|------|-------------------|
|    1 | 10101001010100001 |
|    2 | 10100001110101001 |

## Day 17

Another A* (with a twist). Part 2 is solved with an exhaustive depth-first search. It finishes quickly, so no big deal.

| Part |   Answer   |
|------|------------|
|    1 | DRDRULRDRD |
|    2 |        384 |

## Day 18

| Part |  Answer  |
|------|----------|
|    1 |     1956 |
|    2 | 19995121 |

## Day 19

I figured out a clever way to do part 1, but it doesn't work with part 2. I couldn't think of an easy way to solve part 2. The naive way is O(n^2) and is too slow. I looked up a better way using two equal-sized deques and implemented that. Apparently (and not surprisingly), there are even better solutions: it's called the Josephus problem.

| Part |  Answer |
|------|---------|
|    1 | 1815603 |
|    2 | 1410630 |

## Day 20

Interval math is popular in AoC. I think I have implemented a library in every one so far.

| Part |  Answer  |
|------|----------|
|    1 | 31053880 |
|    2 |      117 |

## Day 21

Lots of typing but otherwise trivial. The key to part 2 is to just create a table. There are only 8 elements.

| Part |  Answer  |
|------|----------|
|    1 | fdhbcgea |
|    2 | egfbcadh |

## Day 22

The solution to part 2 lends itself to a depth-first search, but the size of the state makes a generic search impossible. I inspected the data and I found these facts:

1. There is one empty node.
2. There are several nodes whose contents cannot be moved.
3. No nodes can be combined.

These facts reduce the puzzle to exactly what the example in the description shows: move the empty space around in a way to allow the data to move to the left.

In fact, after drawing the map, I don't even need to write an algorithm to find the solution. The solution is the sum of these steps:

1. Move the empty space to the left to get around the blocked cells: 3 steps
2. Move the empty space to y = 0: 20 steps
3. Move the empty space to the left of the data: 5 steps
4. Do this sequence 30 times: 150 steps
   1. Move the data to the left: 1 step.
   2. Move the empty space to left of the data: 4 steps.
5. Move the data to the goal node: 1 step.

The total is 179 steps. I might come back and actually write an algorithm to solve this some day, but probably not.

| Part | Answer |
|------|--------|
|    1 |    985 |
|    2 |    179 |
