/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class SourceRecord extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        console.info('============= END : Initialize Ledger ===========');
    }

    async querySourceRecord(ctx, sourceRecordID) {
        const sourceRecordAsBytes = await ctx.stub.getState(sourceRecordID); // get the source record from chaincode state
        if (!sourceRecordAsBytes || sourceRecordAsBytes.length === 0) {
            throw new Error(`${sourceRecordAsBytes} does not exist`);
        }
        console.log(sourceRecordAsBytes.toString());
        return sourceRecordAsBytes.toString();
    }

    async createSourceRecord(ctx, id, metalpurity, metalname, sourcename,createdby, createdate) {
        console.info('============= START : Create SR ===========');

        const sourceRecord = {
            id,
            docType: "sourcerecord",
            metalname,
            metalpurity,
            sourcename,
            createdby,
            createdat,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(sourceRecord)));
        console.info('============= END : Create SR ===========');
    }

    async queryAllSourceRecord(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            console.log("looping all results");
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                let objResult = JSON.parse(strValue);
                console.log("obj result", objResult);
                if (objResult.docType == "sourcerecord") {
                    record = objResult;
                    console.log("doctype is sourcerecord, adding", record);
                    allResults.push({ Key: key, Record: record });

                }

            } catch (err) {
                // console.log(err);
                console.log("error occurred", err);
                // record = strValue;
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }



}

module.exports = SourceRecord;