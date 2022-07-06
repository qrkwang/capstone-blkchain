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
        if (!metalItemAsBytes || metalItemAsBytes.length === 0) {
            throw new Error(`${metalitemnumber} does not exist`);
        }
        console.log(metalItemAsBytes.toString());
        return metalItemAsBytes.toString();
    }

    async createMetalItem(ctx, id, sourcerecordid, itemname, createdby, createdat) {

        console.info('============= START : Create MI ===========');

        const metalitem = {
            id,
            docType: "metalitem",
            sourcerecordid,
            itemname,
            createdby,
            createdat,
        };

        console.log(metalitem)

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(metalitem)));
        console.info('============= END : Create MI ===========');
    }

    async queryAllMetalItem(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                let objResult = JSON.parse(strValue);
                console.log("obj result", objResult);
                if (objResult.docType == "metalitem") {
                    record = objResult;
                    console.log("doctype is metalitem, adding", record);
                    allResults.push({ Key: key, Record: record });

                }
            } catch (err) {

                console.log("error occurred", err);

            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

}

module.exports = MetalItem;
