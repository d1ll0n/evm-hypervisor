# EMASM

This repo is for EMASM, the Ethereum Macro Assembler (derived from the name MASM for the classic Microsoft Macro Assembler). EMASM was developed for the ETHBoston 2019 hackathon to provide tooling for a technique that came to me in a dream I had a few weeks earlier.

## The Technique

First it is necessary to understand how a transaction to create a contract works:
When you omit the "to" field in a eth_sendTransaction payload it essentially gives a new meaning to your calldata, instead of loading a contract binary as opcodes and making the calldata available to the opcodes via CALLDATACOPY/CALLDATALOAD, your calldata actually IS opcodes and essentially any logic you perform in the constructor has the address of the future contract before the contract runtime code is even loaded. Once the constructor function finishes running it will typically CODECOPY the runtime code of the contract (which is simply appended to the end of the constructor function) and RETURN the entire buffer. The return data of this transaction is now stored on chain and is the opcodes that get loaded in the "to" address.

Now that you understand this, what do you think will happen if you pass your contract deploy code from solc to "eth_call" and omit the "to" field? Well, it turns out, a standard ETH RPC will also think you are a contract constructor, but since this is "eth_call," it will just return your runtime data as a response. Now, what if you exploit this behavior to actually not return runtime code at all, why don't we just do any EVM code and RETURN the result of this computation? This becomes much more useful when you use CALL instructions to actually directly call as many contracts as you need to, or even the same one (which just has a poor API for returning batch data) and also we don't want to have to deploy a proxy contract as a view layer to perform this task. In fact, we can write these payloads to avoid doing any of the ABI encoding/decoding we would have to do in Solidity as we pack/unpack inputs/outputs between phases of deriving the final output, and also we can skip the overhead of the ETH node loading the view layer binary from the trie to setup the execution context. All of this matters if you are trying to max out the performance of doing complex reads from the chain accessible via contract APIs, and it's also fun!

## So what is EMASM?

EMASM is a JavaScript function that assembles any EVM bytecode from an AST which is actually expressed as a nested array. It has some properties that allow you to very easily generate potentially massive "eth_call" tx script payloads or even a full fledged contract. It is highly inspired by the Huff language invented by AZTEC for writing the most gas efficient contracts possible, and attempts to be capable of the same efficiency in the final binary. All EVM opcodes are available as lowercase, except numbers and hex strings are translated into PUSH instructions of the minimal required width to encode. Defining new segments of code which are reachable via a JUMPDEST is done by declaring an array where the first element is a unique string representing a jump label, and the second element is an array that contains your segment. The segment can be defined anywhere but the label is then usable anywhere in the program as a shorthand for a PUSH instruction encoding the jump destination.

Example:
```
emasm([
  '0x1', 'addatwo', 'jump',
  ['somelabel', ['0x0', 'mstore', '0x20', '0x0', 'return']],
  ['addatwo', ['0x2', 'add', 'somelabel', 'jump']],
]);

// computes 0x1 + 0x2 in an extremely obfuscated manner
```

Similar syntax exists for encoding raw bytes into the binary, in case you want to use CODECOPY to copy some data to memory for any reason. Just prefix your label with `bytes:` and anywhere in the program you can use `bytes:<label>:ptr` or `bytes:<label>:size`. The fact that the second element of the array for a bytes string is also an array is for consistency with the syntax for segments; elements in the array defining your bytes beyond the first element are simply discarded.

```
emasm([
  ['bytes:somelabel', ['0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff']],
  ['bytes:somelabel:ptr', 'bytes:somelabel:size']
]);

// defines a long bytes string with all bits set and then pushes the offset into the final binary where the bytes segment is encoded, then pushes the size in bytes of the string on the stack
```

The only other things to note in emasm is that your segments and bytes that you encode in the AST occur in the final binary in the order they appear. Additionally, the only special rules around nested arrays are when an array appears that follows the rules for defining labels or bytes segment. The entire array is essentially recursively flattened. The motivation for this is that it makes your macros completely composable without having to consider any sort of concat operations with arrays.

There is very little validation in the EMASM assembler function, primarily due to the idea that we want to max out the speed at which we can go from AST to bytecode on your dApp. I have various other copouts if you don't like that one. Eventually I will add an optional pass to the assembler that will provide errors.

## How do I even use assembly?

EVM assembly takes practice! But luckily, it's easier than assembly languages for modern chipsets. Skim the Ethereum yellow paper and pay close attention to the appendix for the list of possible opcodes. All of these opcodes can be used in EMASM!

For an easier reference after you're introduced, check out the Solidity docs for inline assembly, essentially the first argument to Solidity assembly functions must be the topmost position on the stack, second argument is the item on the stack pushed on immediately prior to the topmost, etc. Good luck.

## Do you have any macros?

Not really, but if you make a good one make a npm module and feel free to share and I can post links to it here. It would be neat to at least see an implementation of ABIEncoderv2, something I wanted in Huff but seemed not doable in a generic way with Huff's version of metaprogramming.

## Author

Raymond Pulver IV
Author of IDEX
Ostensible Madman
