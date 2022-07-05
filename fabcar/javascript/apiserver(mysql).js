var mysql = require("mysql");
var express = require('express');
const { response } = require("express");
var bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');

const path = require('path');
const fs = require('fs');

const options = {
        key: fs.readFileSync('../certs/key1.pem'),
        cert: fs.readFileSync('../certs/cert1.pem')
}

function initializeConnection(config) {
  function addDisconnectHandler(connection) {
    connection.on("error", function (error) {
      if (error instanceof Error) {
        if (error.code === "PROTOCOL_CONNECTION_LOST") {
          console.error(error.stack);
          console.log("Lost connection. Reconnecting...");

          initializeConnection(connection.config);
        } else if (error.fatal) {
          throw error;
        }
      }
    });
  }

  var connection = mysql.createConnection(config);
  addDisconnectHandler(connection);

  connection.connect();
  return connection;
}

var connection = initializeConnection({
  user: "qr",
  host: "localhost",
  database: "capstonedb",
  password: "password",
});


var app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));


const { v4: uuidv4 } = require('uuid');



//SOURCE RECORD ============================== START ======================================

app.get('/api/queryallsr', async function (req, res)  {
    console.log("queryallsr");

    connection.query(
    "SELECT * FROM sourcerecord",
    (error, results) => {

        if (error) {
            console.log("error", error)
            throw error;
        } else {

            res.status(200).json(results);
        }
    });
});


app.get('/api/querysr/:sr_index', async function (req, res) {
        console.log("query single sr");

        paramId = req.params.sr_index;
        connection.query(
        "SELECT * FROM sourcerecord WHERE id = " + paramId,
        (error, results) => {

          if (error) {
            console.log("error",error);
            throw error;
            res.status(301).json(error);
          } else {
            res.status(200).json(results);
          }
        }
      );

    
});



app.post('/api/addsr/', async function (req, res) {
        console.log("addsr");

        const metalpurity = req.body.metalpurity;
        const metalname = req.body.metalname;
        const sourcename = req.body.sourcename;

        const sql = "Insert into sourcerecord(metalpurity,metalname,sourcename, createdby, createdat) values (?,?,?,?,?)";

        // Date
        const timestamp = new Date().getTime();
        // console.log(timestamp); // 1642664853302

        const date = new Date(timestamp).toLocaleString('en-SG', {
                timeZone: 'Asia/Singapore',
                hour12: false

        })

        connection.query(
        sql,
        [metalpurity, metalname, sourcename, "metalproductionUser", date],
        (error, results, fields) => {  
          if (error) {
            throw error;
          }
          res.status(201).json(results);
       });
           
    });


//SOURCE RECORD ============================== END ======================================



//METAL ITEM ============================== START ======================================
app.get('/api/queryallmi', async function (req, res)  {
        
    console.log("queryallmi");

    connection.query(
    "SELECT * FROM metalitem",
    (error, results) => {

        if (error) {
            console.log("error", error)
            throw error;
        } else {

            res.status(201).json(results);
        }
    });

});


app.get('/api/querymi/:mi_index', async function (req, res) {
        console.log("query mi");
        paramId = req.params.mi_index;

        connection.query(
        "SELECT * FROM metalitem WHERE id = " + paramId,
        (error, results) => {

          if (error) {
            console.log("error",error);
            throw error;
            res.status(301).json(error);
          } else {
            res.status(200).json(results);
          }
        }
      );
});

// app.get('/api/querymiandmc/:mi_index', async function (req, res) {
//         console.log("query mi and mc");
//         paramId = req.params.mi_index;
//         console.log("param id", paramId);
        
//         const identityStr = "manufacturerUser"

//     try {
// const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const identity = await wallet.get('appUser');
//         if (!identity) {
//             console.log('An identity for the user ' + identityStr +' does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }
//   // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: identityStr, discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         let network = await gateway.getNetwork('mychannel');

//         // Get the contract from the network.
//         let contract = network.getContract('mychain', 'MetalItem');
// // Evaluate the specified transaction.
//         const result = await contract.evaluateTransaction('queryMetalItem', paramId);
//         console.log(`MI has been evaluated, result is: ${result.toString()}`);

//         network = await gateway.getNetwork('mychannel');
//         contract = network.getContract('mychain', 'MetalComposition');
//         let mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
//         mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
//         mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
//         mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
//         mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);
//         mcResult = await contract.evaluateTransaction('queryMCByMI', paramId);

//         console.log(`MC has been evaluated, result is ${mcResult.toString()}`);



//         res.status(200).json({mi: result.toString(), mc: mcResult.toString()});
// } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         res.status(500).json({error: error});
//     }
// });



app.post('/api/addmi/', async function (req, res) {
        console.log("addmi");

        const identityStr = "manufacturerUser"

        const itemname = req.body.itemname;
        const sourcerecordid = req.body.sourcerecordid;
        const metalCompositionArray = req.body.mcarray
        console.log("req body is ", req.body);

        // console.log("metalCompositionArray is ", metalCompositionArray, itemname, sourcerecordid);

        const sql = "Insert into metalitem(itemname,sourcerecordid, createdby, createdat) values (?,?,?,?)";

        // Date
        const timestamp = new Date().getTime();
        // console.log(timestamp); // 1642664853302

        const date = new Date(timestamp).toLocaleString('en-SG', {
                timeZone: 'Asia/Singapore',
                hour12: false

        })

        let metalItemInsertedId = "";
        connection.query(
        sql,
        [itemname, sourcerecordid, identityStr, date],
        (error, results, fields) => {  
          if (error) {
            console.log("error", error);
          }

          metalItemInsertedId = results.insertId; 

          if (!results.insertId) {
            console.log("no insertID found");
            res.status(301).send("problem creating metalitem");

          } else {

          console.log("Metal Item Created", metalItemInsertedId);

        const sql1 = "Insert into metalcomposition(name,percentage,metalitemid, createdby, createdat) values (?,?,?,?,?)" 

                metalCompositionArray.forEach(async (item) => {
                    console.log('name: ' + item.name);
                    console.log('percentage: ' + item.percentage);

                    connection.query(
                        sql1,
                        [item.name, item.percentage, metalItemInsertedId, identityStr, date],
                        (error, results, fields) => {  
                          if (error) {
                            console.log("error", error);
                          }
                          console.log("Metal Composition Created");
                          console.log("results after creating MC", results);

                    });

                });

                res.status(201).send({text: "Transaction has been submitted", uuid: metalItemInsertedId});

        }


       });

      


  



})


//METAL ITEM ============================== END ======================================

//METAL COMPOSITION ============================== START ======================================

app.get('/api/queryallmc', async function (req, res)  {

        console.log("queryallmc");

    connection.query(
    "SELECT * FROM metalcomposition",
    (error, results) => {

        if (error) {
            console.log("error", error)
            throw error;
        } else {

            res.status(200).json(results);
        }
    });

});

app.get('/api/querymcbymi/:mi_index', async function (req, res) {
        console.log("query mc by mi");
        paramId = req.params.mi_index;
        console.log("param", paramId);

        connection.query(
        "SELECT * FROM metalcomposition WHERE metalitemid = " + paramId,
        (error, results) => {

          if (error) {
            console.log("error",error);
            throw error;
            res.status(301).json(error);
          } else {
            res.status(200).json(results);
          }
        }
      );


});

// //METAL COMPOSITION ============================== END ======================================

https.createServer(options, app).listen(8081, ()=> {
        console.log('Server listening on port 8081');
});

