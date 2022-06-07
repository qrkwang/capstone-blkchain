/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MetalItem extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        //    const metalitem = {
        //     itemname: '100%',
        //     metalcomposition: 'MC00001',
        // };

        // await ctx.stub.putState('MI00001', Buffer.from(JSON.stringify(metalitem)));
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryMetalItem(ctx, metalitemnumber) {
        const metalItemAsBytes = await ctx.stub.getState(metalitemnumber); // get the car from chaincode state
        if (!metalItemAsBytesAsBytes || metalItemAsBytesAsBytes.length === 0) {
            throw new Error(`${metalitemnumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createMetalItem(ctx, metalcompositionid, itemname) {
        //Retrieve latest id for metalitem and metalcomposition, increment them for this current creation
       for await (const {key, value} of ctx.stub.getStateByRange('', '')) {
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
        //Create metalcomposition here as well

        console.info('============= START : Create Car ===========');

        const metalitem = {
            metalcompositionid,
            itemname,
        };

        await ctx.stub.putState(metalcompositionid, Buffer.from(JSON.stringify(metalitem)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllMetalItem(ctx) {
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

}

module.exports = MetalItem;
