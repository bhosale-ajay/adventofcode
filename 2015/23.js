var testInput = `inc a
jio a, +2
tpl a
inc a`;

var mainInput = `jio a, +16
inc a
inc a
tpl a
tpl a
tpl a
inc a
inc a
tpl a
inc a
inc a
tpl a
tpl a
tpl a
inc a
jmp +23
tpl a
inc a
inc a
tpl a
inc a
inc a
tpl a
tpl a
inc a
inc a
tpl a
inc a
tpl a
inc a
tpl a
inc a
inc a
tpl a
inc a
tpl a
tpl a
inc a
jio a, +8
inc b
jie a, +4
tpl a
inc a
jmp +2
hlf a
jmp -7`;
 
/*
hlf r sets register r to half its current value, then continues with the next instruction.
tpl r sets register r to triple its current value, then continues with the next instruction.
inc r increments register r, adding 1 to it, then continues with the next instruction.
jmp offset is a jump; it continues with the instruction offset away relative to itself.
jie r, offset is like jmp, but only jumps if register r is even ("jump if even").
jio r, offset is like jmp, but only jumps if register r is 1 ("jump if one", not odd).
*/

function hlf(registers, register, offset) {
    registers[register] = registers[register] / 2;
    return 1;
}

function tpl(registers, register, offset) {
    registers[register] = registers[register] * 3;
    return 1;
}

function inc(registers, register, offset) {
    registers[register] = registers[register] + 1;
    return 1;
}

function jmp(registers, register, offset) {
    return offset;
}

function jie(registers, register, offset) {
    return registers[register] % 2 == 0 ? offset : 1;
}

function jio(registers, register, offset) {
    return registers[register] == 1 ? offset : 1;
}

function executeCode(input, regToCheck, valueForA) {
    var expression = /([a-z]{3})\s*(a|b)?,?\s*([+|-]\d+)*/ig;
    var line;
    var codeLines = [];
    var registers = {};
    var currentLine = 0;

    while ((line = expression.exec(input)) !== null) {
        var instruction = line[1];
        var register = line[2] || "";
        if (register.length > 0) {
            registers[register] = 0;
        }
        var offset = parseInt(line[3]);
        codeLines.push({ instruction, register, offset });
    }

    if (valueForA) {
        registers["a"] = valueForA;
    }

    while (currentLine < codeLines.length) {
        var currentInstruction = codeLines[currentLine];
        var instructionExecutor = eval(currentInstruction.instruction);
        currentLine = currentLine + instructionExecutor(registers, currentInstruction.register, currentInstruction.offset);
    }

    console.log(registers[regToCheck]);
}

//executeCode(testInput, 'a');

//170
executeCode(mainInput, 'b');
//247
executeCode(mainInput, 'b', 1);