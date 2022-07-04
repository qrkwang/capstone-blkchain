/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Generic extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        console.info('============= END : Initialize Ledger ===========');
    }

    async queryAll(ctx) {

        const accessRole = ctx.clientIdentity.getAttributeValue("accessRole");
        console.info("ctx", accessRole);

        if (accessRole == "admin") {
            const startKey = '';
            const endKey = '';
            const allResults = [];
            for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
                const strValue = Buffer.from(value).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    console.log(err);
                    record = strValue;
                }
                allResults.push({ Key: key, Record: record });
            }
            // console.info(allResults);
            return JSON.stringify(allResults);

        } else {
            return "403"
        }

    }
  
}

module.exports = Generic;