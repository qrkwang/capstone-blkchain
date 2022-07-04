var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');

var app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));


// Setting for Hyperledger Fabric
const { Gateway,Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const options = {
        key: fs.readFileSync('../certs/key1.pem'),
        cert: fs.readFileSync('../certs/cert1.pem')
}


//GENERIC  ============================== START ======================================
app.get('/api/queryall', async function (req, res)  {
        console.log("queryall");
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');


        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'Generic');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAll');
        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);


        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});

app.post('/api/queryidentity/', async function (req, res)  {
        
        // const paramId = req.params.wallet_user;
        // const privateKey = req.params.privatekey;
        
        const walletUser = req.body.walletuser;
        const privateKey = req.body.privatekey;
        console.log("queryidentity");
        console.log("wallet user", walletUser);
        console.log("private key", privateKey);

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


      
        const identity = await wallet.get(walletUser);


        // Check to see if we've already enrolled the user.
        if (!identity) {
                console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                res.status(301).send("Does not exist");
        } else {
                console.log("exist");
                let walletPrivateKey = identity.credentials.privateKey.replace("-----BEGIN PRIVATE KEY-----", "")
                walletPrivateKey = walletPrivateKey.replace("-----END PRIVATE KEY-----", "");
                walletPrivateKey = walletPrivateKey.replace(/\r?\n?/g, '')

                console.log("privateKey", walletPrivateKey);
                
                if (privateKey === walletPrivateKey) {
                        console.log("same private key");
                        res.status(201).send("Same Private Key");
                } else {
                        res.status(302).send("Wrong private key");

                }

        }

        // // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork('mychannel');

        // // Get the contract from the network.
        // const contract = network.getContract('mychain', 'Generic');

        // // Evaluate the specified transaction.
        // const result = await contract.evaluateTransaction('queryAll');
        // // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);


        // // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // res.status(200).json({response: result.toString()});

        // // Disconnect from the gateway.
        // await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});
//GENERIC RECORD ============================== END ======================================

//SOURCE RECORD ============================== START ======================================

app.get('/api/queryallsr', async function (req, res)  {
        const identityStr = "metalProductionUser"

        console.log("queryallsr");
    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'SourceRecord');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAllSourceRecord');
	console.log("result received from contract");

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error.toString});
    }
});




app.get('/api/querysr/:sr_index', async function (req, res) {
        console.log("query single sr");
        const identityStr = "metalProductionUser"

        paramId = req.params.sr_index;

    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(identityStr);
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'SourceRecord');
// Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('querySourceRecord', paramId);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
} catch (error) {
        const errorStr = error.toString();

        if (errorStr.includes("does not exist")) {
                console.log("Data does not exist");
                res.status(301).send("Data does not exist");

        } else {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error.toString});
        }
    }
});



app.post('/api/addsr/', async function (req, res) {
        console.log("addsr");

        const identityStr = "metalProductionUser"

        const metalpurity = req.body.metalpurity;
        const metalname = req.body.metalname;
        const sourcename = req.body.sourcename;
        // const metalpurity = "100%"
        // const metalname = "Alu"
        // const sourcename = "Chinalco"
    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(identityStr);
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'SourceRecord');
// Submit the specified transaction.
            // async createSourceRecord(ctx, id, metalpurity, metalname, sourcename) {

        const srUUID = uuidv4()+"";

        //Date
        const timestamp = new Date().getTime();
        console.log(timestamp); // 1642664853302

        const date = new Date(timestamp).toLocaleString('en-SG', {
                timeZone: 'Asia/Singapore',
                hour12: false

        })
        console.log(date); //  Thu Jan 20 2022 09:48:00

        console.log("submitting transaction");
        await contract.submitTransaction('createSourceRecord', srUUID, metalpurity, metalname, sourcename, identityStr, date );
        console.log('Transaction has been submitted');
        res.status(201).send({text: 'Transaction has been submitted', uuid: srUUID});
// Disconnect from the gateway.
        await gateway.disconnect();
} catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
})


//SOURCE RECORD ============================== END ======================================



//METAL ITEM ============================== START ======================================
app.get('/api/queryallmi', async function (req, res)  {
        
        const identityStr = "manufacturerUser"

    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(identityStr);
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'MetalItem');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAllMetalItem');
        console.log("result received from contract");

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});




app.get('/api/querymi/:mi_index', async function (req, res) {
        console.log("query mi");
        paramId = req.params.mi_index;
        console.log("param id", paramId);

        const identityStr = "manufacturerUser"

    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'MetalItem');
// Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryMetalItem', paramId);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});

app.get('/api/querymiandmc/:mi_index', async function (req, res) {
        console.log("query mi and mc");
        paramId = req.params.mi_index;
        console.log("param id", paramId);
        
        const identityStr = "manufacturerUser"

    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        let network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        let contract = network.getContract('mychain', 'MetalItem');
// Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryMetalItem', paramId);
        console.log(`MI has been evaluated, result is: ${result.toString()}`);

        network = await gateway.getNetwork('mychannel');
        contract = network.getContract('mychain', 'MetalComposition');
        let mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
        mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
        mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
        mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
        mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
        mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);

        console.log(`MC has been evaluated, result is ${mcResult.toString()}`);



        res.status(200).json({mi: result.toString(), mc: mcResult.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});



app.post('/api/addmi/', async function (req, res) {

        const identityStr = "manufacturerUser"

        const itemname = req.body.itemname;
        const sourcerecordid = req.body.sourcerecordid;
        // const itemname = "Metal Can"
        // const sourcerecordid = "SR UUID"
        const metalCompositionArray = req.body.mcarray
        console.log("req body is ", req.body);

        console.log("metalCompositionArray is ", metalCompositionArray, itemname, sourcerecordid);
    try {

const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


        //Date
        const timestamp = new Date().getTime();
        console.log(timestamp); // 1642664853302

        const date = new Date(timestamp).toLocaleString('en-SG', {
                timeZone: 'Asia/Singapore',
                hour12: false

        })

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(identityStr);
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });



// Submit the transaction to create Metal Item
        // Get the network (channel) our contract is deployed to.
        let network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        let contract = network.getContract('mychain', 'MetalItem');

        let metalItemUUID = uuidv4()+"";
        console.log("submitting transaction for metal item with uuid ", metalItemUUID);

        await contract.submitTransaction('createMetalItem', metalItemUUID, sourcerecordid, itemname, identityStr, date);
        console.log('Transaction has been submitted');

        // console.log("contract after submit", contract);

// Submit the transaction/s to create Metal Composition/s

        // Get the network (channel) our contract is deployed to.
        network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        contract = network.getContract('mychain', 'MetalComposition');

        metalCompositionArray.forEach(async (item) => {
          console.log('name: ' + item.name);
          console.log('percentage: ' + item.percentage);

          console.log("submitting transaction for metal composition");
        await contract.submitTransaction('createMetalComposition', uuidv4()+"", item.name, item.percentage, metalItemUUID, identityStr, date);
       // const mcResult = await contract.evaluateTransaction('queryMCByMI', metalItemUUID);
        // console.log(`MC has been evaluated, result is ${mcResult.toString()}`);
        });


        console.log("Metal Item Created");
        res.status(201).send({text: "Transaction has been submitted", uuid: metalItemUUID});

// Disconnect from the gateway.
        await gateway.disconnect();
} catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
})


//METAL ITEM ============================== END ======================================

//METAL COMPOSITION ============================== START ======================================

app.get('/api/queryallmc', async function (req, res)  {

        const identityStr = "manufacturerUser"

        console.log("queryallmc");
    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'MetalComposition');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAllMetalComposition');
        console.log("result received from contract");

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

app.get('/api/querymcbymi/:mi_index', async function (req, res) {
        const identityStr = "manufacturerUser"

        console.log("query mc by mi");
        paramId = req.params.mi_index;
        console.log("param", paramId);

    try {
const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
  // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychain', 'MetalComposition');
// Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryMCByMI', paramId);
        console.log(`Transaction MC has been evaluated, result is: ${result.toString()}`);
        res.status(201).json({response: result.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

//METAL COMPOSITION ============================== END ======================================

https.createServer(options, app).listen(8081, ()=> {
        console.log('Server listening on port 8081');
});

