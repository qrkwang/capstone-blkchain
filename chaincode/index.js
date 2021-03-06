/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const SourceRecord = require('./lib/sourcerecord');
const MetalItem = require('./lib/metalitem');
const FabCar = require('./lib/fabcar');
const General = require('./lib/general');
const MetalComposition = require('./lib/metalcomposition');

// module.exports.FabCar = FabCar;
module.exports.SourceRecord = SourceRecord;
module.exports.MetalItem = MetalItem;
module.exports.General = General;
module.exports.MetalComposition = MetalComposition;

// module.exports.contracts = [ FabCar, MetalItem];
module.exports.contracts = [ SourceRecord, MetalItem, MetalComposition, General];

