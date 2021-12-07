# step-sequencer

An EventEmitter-based step-sequencer for Node.js.

# Usage
```javascript
var StepSequencer = require('step-sequencer');

// Instantiate a new StepSequencer object
var tempo = 120;
var division = 4;
var sequence = [0, 1, 2, 3];
var stepSequencer = new StepSequencer(tempo, division, sequence);

// The StepSequencer emits the number of
// the step when that step is to be played
stepSequencer.on('0', function (step) {
    console.log(step);
})
.on('1', function (step) {
    console.log(step);
})
.on('2', function (step) {
    console.log(step);
})
.on('3', function (step) {
    console.log(step);
});

// Begin playing the sequence
stepSequencer.play();
// 0
// 1
// 2
// 3 ...
```
There is also a variant, sigle event

```javascript
var tempo = 120;
var division = 4;
var sequence = ['A', 'B', 'C', 'D'];

//pass true as last parameter to enable 
var stepSequencer = new StepSequencer(tempo, division, sequence, true);

stepSequencer.on('step', function (step, data) {
  console.log(`#${step}: ${data}`);
});


// Begin playing the sequence
stepSequencer.play();
/*
output:
#0: A
#1: B
#2: C
#3: D
*/
# API
```

## StepSequencer.constructor

Constructrs the `StepSequencer` object:
```javascript
var stepSequencer = new StepSequencer(tempo = 120, division = 4, sequence = [], altEvent = false);
```

- `tempo` is the tempo of playback
- `division` is the number of beats per measure
- `sequence` is the sequence of data to be emitted
- `altEvent` set this to true for alternate event generation

## StepSequencer.prototype.play

Begins playing the sequence:
```javascript
stepSequencer.play();
// 0
// 1
// 2
// 3 ...
```

## StepSequencer.prototype.stop

Stops playing the sequence, does not reset the current step:
```javascript
// 0
// 1
stepSequencer.stop();
```

## StepSequencer.prototype.resume

Resumes playing from the current step. Continued from the previous example:
```javascript
stepSequencer.resume();
// 2
// 3 ...
```

## StepSequencer.prototype.setTempo

Sets the tempo, even if the `stepSequencer` is playing:
```javascript
stepSequencer.setTempo(120);
```

## StepSequencer.prototype.setSequence

Sets the division and sequence, even if the `stepSequencer` is playing.

The tempo is updated as well, if the division changes:
```javascript
stepSequencer.setSequence(4, [1, 2, 3, 4]);
```

## Events

| Event | Params  |What |
|:-----:|:--------|:----|
|1,2,3  | sequence| Each event represents a step |
| step  | step, sequence | Alternate step event |
| play  | first sequence element | generated when starting playing |
| resume| step, sequence | generated when resuming |
| stop  | step, sequence | stopped |
| sequence-change | old-sequence, new-sequence, step | Sequence array has been changed |


# License

MIT
