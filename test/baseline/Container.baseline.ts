/* eslint-disable @typescript-eslint/no-empty-function */
import { Suite } from 'benchmark';
import { Container } from 'internal:typedi';

const suite = new Suite('Container');

suite.add('#get and #set a string-based identifier', () => {

});

suite.add('#get and #set a Token-based identifier', () => {

});

suite.add('#has when ID does not exist', () => {

});

suite.add('#has when ID does exist', () => {

});



// templates
suite.add('#getMany', () => {

});

suite.add('#getManyOrNull', () => {

});

suite.add('#getOrNull', () => {

});

suite.add('#has', () => {

});

suite.add('#of', () => {

});

suite.add('#ofChild', () => {

});

suite.add('#remove', () => {

});

suite.add('#reset', () => {

});

suite.add('#set', () => {

});

suite.add('#setValue', () => {

});