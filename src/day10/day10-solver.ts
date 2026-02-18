import { match } from "assert/strict";

export interface Result {
  answer: number | string;
}

interface Bot {
  rule: [number, number] | null; // [low, high] where low and high are bot numbers (positive) or output numbers (negative)
  chips: number[];
}

type BotMap = Map<number, Bot>;

const valueRegex = /value (\d+) goes to bot (\d+)/;
const givesRegex = /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/;

function output(bots: BotMap, outputId: number): Bot | undefined {
  return bots.get(toBotId(outputId));
}

// Converts an output ID to a bot ID
function toBotId(outputId: number): number {
  return -outputId - 1; // output 0 -> bot -1, output 1 -> bot -2, etc.
}

// Converts a bot ID to an output ID
function toOutputId(botId: number): number {
  return -(botId + 1);
}

function parseValueRule(line: string): [number, number] {
      const match = line.match(valueRegex);
      if (!match) throw new Error(`Bad line: ${line}`);
      const value = parseInt(match[1], 10);
      const botId = parseInt(match[2], 10);
      return [value, botId];
}

function parseGivesRule(line: string): [number, [number, number]] {
  const match = line.match(givesRegex);
  if (!match) throw new Error(`Bad line: ${line}`);
  const botId = parseInt(match[1], 10);
  const lowType = match[2];
  let low = parseInt(match[3], 10);
  if (lowType === "output") {
    low = toBotId(low);
  }
  const highType = match[4];
  let high = parseInt(match[5], 10);
  if (highType === "output") {
    high = toBotId(high);
  }
  return [botId, [low, high]];
}

function giveChipToBot(bots: BotMap, botId: number, chip: number): void {
  const bot = bots.get(botId) ?? { rule: null, chips: [] };
  bot.chips.push(chip);
  if (bot.chips.length > 2) {
    throw new Error(`Bot ${botId} has more than 2 chips: ${bot.chips}`);
  }
  bots.set(botId, bot);
}

function setRuleForBot(bots: BotMap, botId: number, rule: [number, number]): void {
  const bot = bots.get(botId) ?? { rule: null, chips: [] };
  bot.rule = rule;
  bots.set(botId, bot);
}
  
function parseRules(lines: string[]): BotMap {
  const bots: BotMap = new Map();
  for (const line of lines) {
    if (line.startsWith("value")) {
      const [value, botId] = parseValueRule(line);
      giveChipToBot(bots, botId, value);
    } else if (line.startsWith("bot")) {
      const [botId, [low, high]] = parseGivesRule(line);
      setRuleForBot(bots, botId, [low, high]);
    } else {
        throw new Error(`Unrecognized line: ${line}`);
    }
  }
  return bots;
}

function botIsActive([botId, bot]: [number, Bot]): boolean {
  return botId >= 0 && bot.chips.length === 2;
}

function executeRule(bots: BotMap, botId: number, bot: Bot): void {
  if (!bot.rule) {
    throw new Error(`Bot ${botId} has no rule`);
  }
  giveChipToBot(bots, bot.rule[0], Math.min(...bot.chips));
  giveChipToBot(bots, bot.rule[1], Math.max(...bot.chips));
  bot.chips = [];
  bots.set(botId, bot);
}

export function solvePart1(input: string[]): Result | null {
  const bots: BotMap = parseRules(input);
  for (let activeBots = Array.from(bots.entries()).filter(botIsActive);
       activeBots.length > 0;
       activeBots = Array.from(bots.entries()).filter(botIsActive)) {
    for (const [botId, bot] of activeBots) {
      if (bot.chips.includes(61) && bot.chips.includes(17)) {
        return { answer: botId };
      }
      executeRule(bots, botId, bot);
    }
  }
  return null;
}

export function solvePart2(input: string[]): Result | null {
  const bots: BotMap = parseRules(input);
  for (let activeBots = Array.from(bots.entries()).filter(botIsActive);
       activeBots.length > 0;
       activeBots = Array.from(bots.entries()).filter(botIsActive)) {
    for (const [botId, bot] of activeBots) {
      if (output(bots, 0) !== undefined && output(bots, 1) !== undefined && output(bots, 2) !== undefined) {
        return { answer: output(bots, 0)!.chips[0] * output(bots, 1)!.chips[0] * output(bots, 2)!.chips[0] };
      }
      executeRule(bots, botId, bot);
    }
  }
  return null;
}
