/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const GUI = require('./GUI');

class Memory extends GUI{
    constructor(name, count){
        super(name, count);
    }
}

module.exports = Memory;
