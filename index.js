'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var NanoTimer = require('nanotimer');

function play() {
  if (this._playing) return;
  this.step = 0;
  this._playing = true;
  loop.call(this);
  this.emit('play', this.sequence[0]);
}

function loop() {
  var self = this;
  self.timer.setTimeout(function () {
    advance.call(self);
    if (self._playing) loop.call(self);
  }, '', self.timeout);
}

function advance() {
  if (this.altEvent)
    this.emit('step', this.step, this.sequence[this.step]);
  else
    this.emit('' + this.step, this.sequence[this.step]);
  
  this.step = (++this.step) % this.sequence.length;
}

function resume() {
  if (this._playing) return;
  this._playing = true;
  loop.call(this);
  this.emit('resume', this.step, this.sequence[this.step]);
}

function stop() {
  if (!this._playing) return;
  this._playing = false;
  this.timer.clearTimeout();
  this.emit('stop', this.step, this.sequence[this.step]);
}

function setTempo(tempo) {
  if (typeof tempo !== 'number') throw new TypeError('Tempo must be a number');
  this.tempo = tempo;
  this.timeout = Math.floor((60 / (this.tempo * this.division)) * 10e8) + 'n';
}

function setSequence(division, sequence) {
  if (typeof division !== 'number') throw new TypeError('Division must be a number');
  if (!(sequence instanceof Array)) throw new TypeError('Sequence must be an array');

  this.division = division;
  this.timeout = Math.floor((60 / (this.tempo * this.division)) * 10e8) + 'n';
  
  this.emit('sequence-change', this.sequence, sequence, this.step);
  this.sequence = sequence;
  this.step %= sequence.length;
}

function StepSequencer(tempo, division, sequence, altEvent) {
  if (tempo && typeof tempo !== 'number') throw new TypeError('Tempo must be a number');
  if (division && typeof division !== 'number') throw new TypeError('Division must be a number');
  if (sequence && !(sequence instanceof Array)) throw new TypeError('Sequence must be an array');

  this.tempo = tempo || 120;
  this.division = division || 4;
  this.sequence = sequence || [];
  this.altEvent = (altEvent !== undefined) ? altEvent : false;
  this.step = 0;
  this.timer = new NanoTimer();
  this.timeout = Math.floor((60 / (this.tempo * this.division)) * 10e8) + 'n';
  this._playing = false;
  EventEmitter.call(this);
}

inherits(StepSequencer, EventEmitter);

StepSequencer.prototype.play = play;
StepSequencer.prototype.resume = resume;
StepSequencer.prototype.stop = stop;
StepSequencer.prototype.setTempo = setTempo;
StepSequencer.prototype.setSequence = setSequence;

module.exports = StepSequencer;
