import { getInput } from "./util";

const parse = (ip: string) => getInput(ip).split(" ").map(m => +m);

const traverseNodes = ([childNodesCount, countOfMetaDataEntries, ...rest]: number[]): [number[], number, number] => {
    const valuesOfChildNodes = [];
    let valueOfNode = 0;
    let sumOfMetadata = 0;
    for (let i = 0; i < childNodesCount; i++) {
        const [ remaining, childMetadata, value ] = traverseNodes(rest);
        sumOfMetadata = sumOfMetadata + childMetadata;
        valuesOfChildNodes.push(value);
        rest = remaining;
    }
    for (let i = 0; i < countOfMetaDataEntries; i++) {
        const metadata = rest.shift();
        if (metadata === undefined) {
            break;
        }
        if (childNodesCount > 0) {
            if (metadata <= childNodesCount) {
                valueOfNode = valueOfNode + valuesOfChildNodes[metadata - 1];
            }
        } else {
            valueOfNode = valueOfNode + metadata;
        }
        sumOfMetadata = sumOfMetadata + metadata;
    }
    return [rest, sumOfMetadata, valueOfNode];
};

test("08", () => {
    expect(traverseNodes(parse("08-test"))).toEqual([[], 138, 66]);
    expect(traverseNodes(parse("08"))).toEqual([[], 36307, 25154]);
});
