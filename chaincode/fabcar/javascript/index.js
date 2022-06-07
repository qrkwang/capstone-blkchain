/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const SourceRecord = require('./lib/sourcerecord');
const MetalItem = require('./lib/metalitem');

module.exports.SourceRecord = SourceRecord;
module.exports.MetalItem = MetalItem;

// module.exports.contracts = [ FabCar ];
module.exports.contracts = [ SourceRecord, MetalItem];
