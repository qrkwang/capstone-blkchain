/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const { v4: uuidv4 } = require('uuid');

class MetalComposition extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        console.info('============= END : Initialize Ledger ===========');
    }

    async queryMetalComposition(ctx, metalcompositionid) {
        const metalCompositionAsBytes = await ctx.stub.getState(metalcompositionid); // get the car from chaincode state
        if (!metalCompositionAsBytes || metalCompositionAsBytes.length === 0) {
            throw new Error(`${metalcompositionid} does not exist`);
        }
        console.log(metalCompositionAsBytes.toString());
        return metalCompositionAsBytes.toString();
    }

    async createMetalComposition(ctx, id, name, percentage, metalitemid) {

        console.info('============= START : Create MC ===========');

        const metalcomposition = {
            docType: "metalcomposition",
            id,
            name,
            percentage,
            metalitemid,
        };

        console.log(metalcomposition)

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(metalcomposition)));
        console.info('============= END : Create MC ===========');
    }

    async queryAll(ctx) {
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
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryAllMetalComposition(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
            let objResult = JSON.parse(strValue);
            console.log("obj result", objResult);
            if (objResult.docType == "metalcomposition") {
                record = objResult;
                console.log("doctype is metalcomposition, adding", record);
                allResults.push({ Key: key, Record: record });

            }
            catch (err) {
                console.log("error occurred", err);

            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

}

module.exports = MetalComposition;
