import * as inputSets from "./10-input";
import { assert, matchesToArray } from "./util";

let responsibleBotId = -1;
let productOfFirstThree = 1;
let outputBinCounter = 0;
const regex = /(value (\d+) goes to bot (\d+)|bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+))/g;
const robot = { outputBins : [], bots : [] };
const valueReference = (value) => (_) => value;
const botReference = (botId, which) => (_) => robot.bots[botId].getValue(which);
const createBot = (botId) => {
    let inputs = [];
    let inputA;
    let inputB;
    let inputCalculated = false;
    const getValue = (type) => {
        if (!inputCalculated) {
            inputA = inputs[0]();
            inputB = inputs[1]();
            inputCalculated = true;
        }
        if ((inputA === 61 || inputB === 61) && (inputA === 17 || inputB === 17)) {
            responsibleBotId = botId;
        }
        const operation = type === "low" ? Math.min : Math.max;
        return operation(inputA, inputB);
    };
    return { inputs, getValue };
};
const getBotReference = (botId) => robot.bots[botId] ? robot.bots[botId] : (robot.bots[botId] = createBot(botId));
const getOutputBinReference = (outputBinId) => robot.outputBins[outputBinId] = { getValue : () => 0 };
const recordValueInputToBot = (botId, value) => getBotReference(botId).inputs.push(valueReference(value));
const recordBotInputToBot = (toBotId, fromBotId, which) => getBotReference(toBotId).inputs.push(botReference(fromBotId, which));
const recordBotInputToOutputBin = (outputId, fromBotId, which) => getOutputBinReference(outputId).getValue = <any> botReference(fromBotId, which);
const recordBotOutput = (fromBotId, lowTo, lowToId, highTo, highToId) => {
    (lowTo === "bot" ? recordBotInputToBot : recordBotInputToOutputBin)(lowToId, fromBotId, "low");
    (highTo === "bot" ? recordBotInputToBot : recordBotInputToOutputBin)(highToId, fromBotId, "high");
};
const record = (m) => {
    if (m[0].startsWith("value")) {
        recordValueInputToBot(+(m[3]), +(m[2]));
    } else {
        recordBotOutput(+(m[4]), m[5], +(m[6]), m[7], +(m[8]));
    }
};
matchesToArray(inputSets.ip1002, regex).forEach(record);
for (const eachOutputBin of robot.outputBins) {
    const result = eachOutputBin.getValue();
    if (outputBinCounter < 3) {
        productOfFirstThree = productOfFirstThree * result;
    }
    outputBinCounter++;
}
assert(responsibleBotId, 141, "Day 10 - Set 1");
assert(productOfFirstThree, 1209, "Day 10 - Set 2");
