import {
    BrowserRouter,
    Routes,
    Route,
    Link, useNavigate, Navigate
} from "react-router-dom";
import React, { useRef } from 'react';
import ReactToPrint, {useReactToPrint} from 'react-to-print';

import ReactDOM from "react-dom";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import image from './sorticon.png';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useContext} from 'react';

// import Scan from './containers/Scan';
// import Write from './containers/Write';
import { ActionsContext } from './contexts/context';
import {
    Button,
    Container,
    CssBaseline, Dialog,
    DialogActions,
    DialogContent, DialogTitle,
    Divider, IconButton,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import QRCode from "react-qr-code";
import {QrReader} from "react-qr-reader";
// import {useCallback, useContext} from "types/react";
import Scanner from "./components/Scanner/Scanner";
import Writer from "./components/Writer/Writer";
import Write from "./containers/Write";

//Made axios global
const axios = require("axios"); //use axios for http requests
const instance = axios.create(); //use this instance of axios for http requests
const backendURL = `https://192.168.68.122:8081`

const Home = () => {

  let navigate = useNavigate();

  return (
      <div>
      <Link to="/mpv">Metal Production View </Link>
      <Link to="/m">Manufacturer View </Link>
      <Link to="/rf">Recycling Facility View </Link>

      </div>
    );
}

const MetalProduction = () => {

    let navigate = useNavigate();


    //Form
    const [metalname, setMetalName] = useState("");
    const [metalpurity, setMetalPurity] = useState("");
    const [sourcename, setSourceName] = useState("");

    //Modal Dialog
    const [open, setOpen] = useState(false);
    const [pageContent, setPageContent] = useState("");

    function areFieldsEmpty() {
        if (metalname !== "" && metalpurity !== "" && sourcename !== "") {
            return false;
        } else {
            return true;
        }
    }
    const handleDialogClose = () => {
        setOpen(false);
        resetFields();
    };


    const resetFields = () => {
        setMetalPurity("");
        setMetalName("");
        setSourceName("");

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handlesubmit");
        console.log("fields are %s %s %s", metalname, metalpurity, sourcename );

        if (!areFieldsEmpty()) {

            const obj = {
                metalname: metalname,
                metalpurity: metalpurity,
                sourcename: sourcename,

            };

            instance.post(backendURL + `/api/addsr`, obj)
                .then(res => {
                    // console.log(res);
                    console.log(res.data);
                    console.log("response code is " , res.status);

                    if (res.status === 201) {
                        setPageContent("201");
                        setOpen(true);
                        localStorage.setItem("srUUID", res.data.uuid); // The returned data obj contains userId
                        navigate(`/mpv/print`);

                    }
                }).catch(error => {
                console.log("error while sending request", error);

                // console.log("error while sending request", error.response.status);

                if (error.code = "ERR_NETWORK") {
                    console.log("network error");
                    setPageContent("500");
                    setOpen(true);
                } else {
                    setPageContent("admin")
                    setOpen(true);
                }

            });

        } else {
            setPageContent("empty");
            setOpen(true);
        }
    }

    function renderDialogContent() {
        // console.log("pagecontent is ", pageContent);

        return (
            <Dialog style={{}}
                    fullWidth={true}
                    maxWidth={'lg'}
                    open={open}
                    onClose={ ()=> setOpen(false)}
            >
                <div style={{backgroundColor: '#DFE2D7',}}>
                    <DialogTitle sx={{marginBottom: -1,}}>
                        {pageContent === "500" ? (
                                <div style={{color: 'gray'}}>Cannot connect to network server</div>
                            )
                            : pageContent === "201" ? (
                                    <div style={{color: 'gray'}}>Record Created</div>
                                )
                                : pageContent === "empty" ? (
                                    <div style={{color: 'gray'}}>Empty fields</div>
                                ) : (
                                    <div style={{color: 'gray'}}>Something went wrong</div>
                                )
                        }
                    </DialogTitle>
                </div>
                <DialogContent>
                    {pageContent === "500" ? (
                        <div>
                            <p>There is a connection error to the network server. Please contact the administrator or try again later.</p>
                        </div>
                    ) : pageContent === "201" ? (
                            <div>
                                <p>Record has been successfully created.</p>
                            </div>
                        )
                        : pageContent === "empty" ? (
                            <div>
                                <p>Please fill in all fields before submitting.</p>
                            </div>
                        ) : (
                            <div>
                                <p>Please contact the administrator.</p>
                            </div>
                        )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpen(false)}>Okay</Button>
                </DialogActions>
            </Dialog>
        );

    }
    return (
        <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
                >
            <Container component="main" maxWidth="xs" style={{ }}>
                <CssBaseline />
            <div style = {{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                fontSize: '20px',
                padding: '5px',
            }}>
                Create Source Record
            </div>
            <form

                // className={useStyles.form}
                noValidate
                onSubmit={(e) => handleSubmit(e)}
            >

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="metalname"
                    label="Metal Name"
                    value={metalname}
                    onChange={(e) => setMetalName(e.target.value)}
                    size="normal"
                    InputProps={{ style: { fontSize: '20px' } }}
                    InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="metalpurity"
                    label="Metal Purity"
                    value={metalpurity}
                    onChange={(e) => setMetalPurity(e.target.value)}
                    size="normal"
                    InputProps={{ style: { fontSize: '20px' } }}
                    InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="sourcename"
                    label="Source Name"
                    value={sourcename}
                    onChange={(e) => setSourceName(e.target.value)}
                    size="normal"
                    InputProps={{ style: { fontSize: '20px' } }}
                    InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                />
                <div style = {{
                    display: 'flex',
                    marginTop:'20px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Button
                    type="submit"
                    // fullWidth
                    variant="contained"
                    color="primary"
                    style = {{
                    }}
                >
                    Submit
                </Button>
                </div>

            </form>
                {renderDialogContent()}

            </Container>
        </div>

    );

}
const MetalProductionPrint = () => {

    let navigate = useNavigate();


    //Form
    const [metalname, setMetalName] = useState("");
    const [metalpurity, setMetalPurity] = useState("");
    const [sourcename, setSourceName] = useState("");
    const [srUUID, setSRUUID] = useState("");

    //Modal Dialog
    const [open, setOpen] = useState(false);
    const [pageContent, setPageContent] = useState("");



    useEffect(() => {

        // console.log("srUUID is", localStorage.getItem("srUUID"))
        instance.get(backendURL + `/api/querysr/` + localStorage.getItem("srUUID"))
            .then((res) => {
                const responseObj = JSON.parse(res.data.response);
                console.log("res data", responseObj);
                setMetalName(responseObj.metalname);
                setMetalPurity(responseObj.metalpurity);
                setSourceName(responseObj.sourcename);
                setSRUUID(responseObj.id);

            });


            }, []);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const onWrite = async(message) => {
        console.log("message", message);
        try {
            // if ('NDEFReader' in window) {
            console.log("ndef in window");
            const ndef = new window.NDEFReader();
            // This line will avoid showing the native NFC UI reader
            await ndef.scan();
            await ndef.write({records: [{recordType: "text", data: message}]});
            alert(`Value Saved!`);
            // }
            // else {
            //     console.log("ndef reader not in window");
            // }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs" style={{ }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />}
                onClick={()=> navigate('/mpv')}
                color="primary"
                    style = {{
                        margin: "10px"
                    }}
                >
                    Back
                </Button>

                <CssBaseline />
                <h1>Source Record Created</h1>
                {/*<div style = {{*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'center',*/}
                {/*    // // display: 'flex',*/}
                {/*    // fontSize: '20px',*/}
                {/*    // padding: '5px',*/}
                {/*}}>*/}
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }} ref ={componentRef}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={srUUID}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>

                <h3>Record ID: {srUUID}</h3>
                    <h3>Metal Name: {metalname}</h3>
                    <h3>Metal Purity: {metalpurity}</h3>
                    <h3>Source Name: {sourcename}</h3>

                    <Button
                        type="submit"
                        // fullWidth
                        variant="contained"
                        color="primary"
                        style = {{
                            margin: "10px"
                        }}
                        onClick={handlePrint}
                    >
                        Print QR
                    </Button>

                    <Button
                        type="submit"
                        // fullWidth
                        variant="contained"
                        color="primary"
                        style = {{
                            margin: "10px"

                        }}
                        onClick={()=>onWrite(srUUID)}
                    >
                        Write NFC
                    </Button>

                    {/*<Button*/}
                    {/*    type="submit"*/}
                    {/*    // fullWidth*/}
                    {/*    variant="contained"*/}
                    {/*    color="primary"*/}
                    {/*    style = {{*/}
                    {/*        margin: "10px"*/}

                    {/*    }}*/}
                    {/*    onClick={()=>onHandleAction({scan: null, write: 'writing'})}*/}
                    {/*>*/}
                    {/*    Write NFC*/}
                    {/*</Button>*/}
                {/*<center>*/}
                {/*    <ActionsContext.Provider value={actionsValue}>*/}
                {/*        /!*{scan && <Scan/>}*!/*/}

                {/*        {write && <Write/>}*/}
                {/*    </ActionsContext.Provider>*/}
                {/*</center>*/}
                </div>



            </Container>
        </div>

    );

}

const Manufacturer = () => {

    let navigate = useNavigate();


    //Form
    const [srUUID, setSRUUID] = useState("");
    const [triggerSubmit, setTriggerSubmit] = useState(false);

    //Modal Dialog
    const [open, setOpen] = useState(false);
    const [pageContent, setPageContent] = useState("");

    // NFC scanner
    const [actions, setActions] = useState(null);
    const {scan, write} = actions || {};

    const actionsValue = {actions,setActions};


    const Scan = () => {
        const [message, setMessage] = useState('');
        const [serialNumber, setSerialNumber] = useState('');
        const { actions, setActions} = useContext(ActionsContext);

        const scan = useCallback(async() => {
            // console.log("scan function");
            // console.log("actions is", actions.scan === "scanned");
            if (actions.scan === "scanned") {
                console.log("alr scanned, do nothing");
            } else {
            if ('NDEFReader' in window) {
                try {
                    console.log("first thing in scan function");
                    const ndef = new window.NDEFReader();
                    await ndef.scan();

                    console.log("Scan started successfully.");
                    ndef.onreadingerror = () => {
                        console.log("Cannot read data from the NFC tag. Try another one?");
                    };

                    ndef.onreading = event => {
                        console.log("NDEF message read.");
                        onReading(event);
                        setActions({
                            scan: 'scanned',
                            write: null
                        });
                    };

                } catch(error){
                    console.log(`Error! Scan failed to start: ${error}.`);
                }
            } else {
                console.log("ndef reader not in window");
            }
            }
        },[setActions]);

        const onReading = ({message, serialNumber}) => {
            setSerialNumber(serialNumber);
            for (const record of message.records) {
                switch (record.recordType) {
                    case "text":
                        const textDecoder = new TextDecoder(record.encoding);
                        setMessage(textDecoder.decode(record.data));
                        setSRUUID(textDecoder.decode(record.data));

                        console.log("record data is", textDecoder.decode(record.data));
                        buttonRef.current.click();
                        break;
                    case "url":
                        // TODO: Read URL record with record data.
                        break;
                    default:
                    // TODO: Handle other records with record data.
                }
            }
        };

        useEffect(() => {
            scan();
        }, [scan]);

        console.log("NFC Tag read successfully ", serialNumber, message);
        return(
            <>
                {actions.scan === 'scanned' ?
                    <div>
                        {/*<p>Serial Number: {serialNumber}</p>*/}
                        {/*<p>Message: {message}</p>*/}
                    </div>
                    :
                    <Scanner status={actions.scan}></Scanner> }
            </>
        );
    };

    const onHandleAction = (actions) =>{
        console.log("handle action scan");
        setActions({...actions});
    }

    function areFieldsEmpty() {
        if (srUUID !== "") {
            return false;
        } else {
            return true;
        }
    }
    const handleDialogClose = () => {
        setOpen(false);
        resetFields();
    };


    const resetFields = () => {
        setSRUUID("");

    };

    const handleScan = (result, error) => {


        if (!!result) {
            console.log("result", result);
            setSRUUID(result?.text);
            setTriggerSubmit(true);
            // submitButton.current;
            // this.form.dispatchEvent(
            //     new Event("submit", { cancelable: true, bubbles: true })
            // );

        }

        if (!!error) {
            //Will constantly have error if QR code not shown.
            // console.log("error", error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handlesubmit");
        console.log("fields are %s %s %s", srUUID, );

        if (!areFieldsEmpty()) {

            instance.get(backendURL + `/api/querysr/` + srUUID)
                .then(res => {
                    // console.log(res);
                    const responseObj = JSON.parse(res.data.response)
                    console.log(responseObj);
                    console.log("response code is " , res.status);
                    console.log("response code is " , res);

                    console.log(responseObj.id);

                    if (res.status === 200) {
                        setPageContent("200");
                        localStorage.setItem("srUUID", responseObj.id); // The returned data obj contains userId
                        navigate(`/m/create`);

                    }
                }).catch(error => {
                console.log("error while sending request", error);

                // console.log("error while sending request", error.response.status);

                if (error.response.status == 301) {
                    console.log("data does not exist");
                }
                else{
                    setPageContent("admin")
                    setOpen(true);
                }

            });

        } else {
            setPageContent("empty");
            setOpen(true);
        }
    }

    function renderDialogContent() {
        // console.log("pagecontent is ", pageContent);

        return (
            <Dialog style={{}}
                    fullWidth={true}
                    maxWidth={'lg'}
                    open={open}
                    onClose={ ()=> setOpen(false)}
            >
                <div style={{backgroundColor: '#DFE2D7',}}>
                    <DialogTitle sx={{marginBottom: -1,}}>
                        {pageContent === "500" ? (
                                <div style={{color: 'gray'}}>Cannot connect to network server</div>
                            )
                                : pageContent === "empty" ? (
                                    <div style={{color: 'gray'}}>Empty fields</div>
                                ) : (
                                    <div style={{color: 'gray'}}>Something went wrong</div>
                                )
                        }
                    </DialogTitle>
                </div>
                <DialogContent>
                    {pageContent === "500" ? (
                        <div>
                            <p>There is a connection error to the network server. Please contact the administrator or try again later.</p>
                        </div>
                    )
                        : pageContent === "empty" ? (
                            <div>
                                <p>Please fill in all fields before submitting.</p>
                            </div>
                        ) : (
                            <div>
                                <p>Please contact the administrator.</p>
                            </div>
                        )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpen(false)}>Okay</Button>
                </DialogActions>
            </Dialog>
        );

    }

    const buttonRef = useRef(null)
    let constraints = {
        facingMode: { exact: "environment" }
    };
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs" style={{ }}>
                <CssBaseline />
                <div style = {{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    fontSize: '20px',
                    padding: '5px',
                }}>
                    Scan Source Record
                </div>
                <center>
                    <div style={{marginTop:30}}>


                        <QrReader
                            constraints={ constraints }
                            delay={300}
                            // onError={handleError}
                            // onScan={handleScan}
                            style={{ height: 240, width: 320 }}
                            onResult={handleScan}

                        />
                    </div>

                <div className="App-container">
                    <Button onClick={()=>onHandleAction({scan: 'scanning', write: null})} className="btn">Scan</Button>
                    {/*<Button onClick={()=>onHandleAction({scan: null, write: 'writing'})} className="btn">Write</Button>*/}
                </div>
                <ActionsContext.Provider value={actionsValue}>
                    {scan && <Scan/>}
                    {/*{write && <Write/>}*/}
                </ActionsContext.Provider>
                </center>
                <form
                    // className={useStyles.form}
                    noValidate
                    onSubmit={(e) => handleSubmit(e)}
                >

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="metalname"
                        label="Source Record No."
                        value={srUUID}
                        onChange={(e) => setSRUUID(e.target.value)}
                        size="normal"
                        InputProps={{ style: { fontSize: '20px' } }}
                        InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                    />


                    <div style = {{
                        display: 'flex',
                        marginTop:'20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Button
                            type="submit"
                            // fullWidth
                            variant="contained"
                            color="primary"
                            style = {{
                            }}
                            ref={buttonRef}
                        >
                            Submit
                        </Button>
                    </div>

                </form>
                {renderDialogContent()}

            </Container>
        </div>

    );

}

const ManufacturerCreate = () => {

    let navigate = useNavigate();

    //Form
    const [itemname, setItemName] = useState("");
    const [sourceRecord, setSourceRecord] = useState({});

    //Modal Dialog
    const [open, setOpen] = useState(false);
    const [pageContent, setPageContent] = useState("");
    const [metalname, setMetalName] = useState("");
    const [metalpurity, setMetalPurity] = useState("");
    const [sourcename, setSourceName] = useState("");
    const [srUUID, setSRUUID] = useState("");

    const [inputFields, setInputFields] = useState([
        { id: uuidv4(), name: '', percentage: '' },
    ]);

    useEffect(() => {

        console.log("srUUID is", localStorage.getItem("srUUID"))
        instance.get(backendURL + `/api/querysr/` + localStorage.getItem("srUUID"))
            .then((res) => {
                const responseObj = JSON.parse(res.data.response);
                console.log("res data", responseObj);
                setMetalName(responseObj.metalname);
                setMetalPurity(responseObj.metalpurity);
                setSourceName(responseObj.sourcename);
                setSRUUID(responseObj.id);

            });


    }, []);

    const handleChangeInput = (id, event) => {
        const newInputFields = inputFields.map(i => {
            if(id === i.id) {

                i[event.target.name] = event.target.value
            }
            return i;
        })

        setInputFields(newInputFields);
    }

    const handleAddFields = () => {
        setInputFields([...inputFields, { id: uuidv4(),  name: '', percentage: '' }])
    }

    const handleRemoveFields = id => {
        const values  = [...inputFields];
        values.splice(values.findIndex(value => value.id === id), 1);
        setInputFields(values);
    }

    const handleViewSR = () => {
        console.log("test");
        setPageContent("viewSR");
        setOpen(true);
    }


    function areFieldsEmpty() {
        let areDynamicFieldsEmpty = true;

        [...inputFields].forEach((item) => {
            if (item.name !== "" && item.percentage !== "") {
                //both filled
                // console.log("both are filled");

                areDynamicFieldsEmpty = false;
            } else {
                // if not both filled, they are considered empty.
                // console.log("both are not filled");
                areDynamicFieldsEmpty = true;
            }})

        // console.log("dynamic fields are found to be empty? ", areDynamicFieldsEmpty);
        if (itemname !== "" && areDynamicFieldsEmpty === false) {
            return false;
        } else {
            return true;
        }
    }
    const handleDialogClose = () => {
        setOpen(false);
        resetFields();
    };


    const resetFields = () => {
        setItemName("");
        setInputFields( [{ id: uuidv4(), name: '', percentage: '' }])
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handlesubmit");
        console.log("fields are %s %s %s", itemname, inputFields );

        // [...inputFields].forEach((item) => {
        //     console.log("item", item);
        // })

        if (!areFieldsEmpty()) {

                const obj = {
                    itemname: itemname,
                    sourcerecordid: srUUID,
                    mcarray: [...inputFields],

                };

                instance.post(backendURL + `/api/addmi`, obj)
                    .then(res => {

                        console.log(res);
                        console.log(res.data);
                        console.log("response code is " , res.status);

                        if (res.status === 201) {
                            navigate(`/m/print`);
                            localStorage.setItem("miUUID", res.data.uuid); // The returned data obj contains userId

                        }
                    }).catch(error => {
                    console.log("error while sending request", error);

                    // console.log("error while sending request", error.response.status);

                    if (error.code = "ERR_NETWORK") {
                        console.log("network error");
                        setPageContent("500");
                        setOpen(true);
                    } else {
                        setPageContent("admin")
                        setOpen(true);
                    }

                });

        } else {
            setPageContent("empty");
            setOpen(true);
        }
    }

    function renderDialogContent() {

        return (
            <Dialog style={{}}
                    fullWidth={true}
                    maxWidth={'lg'}
                    open={open}
                    onClose={ ()=> setOpen(false)}
            >
                <div style={{backgroundColor: '#DFE2D7',}}>
                    <DialogTitle sx={{marginBottom: -1,}}>
                        {pageContent === "500" ? (
                                <div style={{color: 'gray'}}>Cannot connect to network server</div>
                            )
                                : pageContent === "empty" ? (
                                    <div style={{color: 'gray'}}>Empty fields</div>
                                )
                                : pageContent === "viewSR" ? (
                                        <div style={{color: 'gray'}}>Source Record</div>
                                )

                                : (
                                <div style={{color: 'gray'}}>Something went wrong</div>
                                )
                        }
                    </DialogTitle>
                </div>
                <DialogContent>
                    {pageContent === "500" ? (
                        <div>
                            <p>There is a connection error to the network server. Please contact the administrator or try again later.</p>
                        </div>
                    )
                        : pageContent === "viewSR" ? (
                                <div>
                                    <h3>Record ID: {srUUID}</h3>
                                    <h3>Metal Name: {metalname}</h3>
                                    <h3>Metal Purity: {metalpurity}</h3>
                                    <h3>Source Name: {sourcename}</h3>
                                </div>
                        )
                        : pageContent === "empty" ? (
                            <div>
                                <p>Please fill in all fields before submitting.</p>
                            </div>
                        ) : (
                            <div>
                                <p>Please contact the administrator.</p>
                            </div>
                        )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpen(false)}>Okay</Button>
                </DialogActions>
            </Dialog>
        );

    }
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs" style={{ }}>
                <CssBaseline />
                <div style = {{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    fontSize: '20px',
                    padding: '5px',
                }}>
                    Create Metal Item


                </div>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '30ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={(e) => handleSubmit(e)}

                    >

                        <div style = {{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            padding: '5px',
                        }}>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="metalname"
                        label="Item Name"
                        value={itemname}
                        onChange={(e) => setItemName(e.target.value)}
                        size="normal"
                        InputProps={{ style: { fontSize: '20px' } }}
                        InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                    />
                        </div>
                    { inputFields.map(inputField => (
                        <div  key={inputField.id} style = {{
                            width: '400px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            padding: '5px',
                            marginLeft: '50px',
                        }}>
                            <TextField
                                name="name"
                                label="Material Name"
                                variant="outlined"
                                margin="normal"
                                required
                                value={inputField.name}
                                onChange={event => handleChangeInput(inputField.id, event)}
                                size="normal"
                                InputProps={{ style: { fontSize: '20px' } }}
                                InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                            />
                            <TextField
                                name="percentage"
                                label="Material %"
                                variant="outlined"
                                margin="normal"
                                required
                                value={inputField.percentage}
                                onChange={event => handleChangeInput(inputField.id, event)}
                                size="normal"
                                InputProps={{ style: { fontSize: '20px' } }}
                                InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                            />
                            <IconButton disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
                                <RemoveIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleAddFields}
                            >
                                <AddIcon />
                            </IconButton>
                        </div>
                    )) }

                        <div style = {{
                            display: 'flex',
                            marginTop:'20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Button
                            onClick={()=> handleViewSR()}
                            variant="contained"
                            color="warning"
                            style = {{
                            }}
                        >
                            View SR
                        </Button>
                        </div>
                    <div style = {{
                        display: 'flex',
                        marginTop:'20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                        <Button
                            type="submit"
                            // fullWidth
                            variant="contained"
                            color="primary"
                            style = {{
                            }}
                        >
                            Submit
                        </Button>
                    </div>

                </Box>
                {renderDialogContent()}

            </Container>
        </div>

    );

}
const ManufacturerPrint = () => {

    let navigate = useNavigate();


    //Form
    const [miUUID, setMIUUID] = useState("");
    const [itemname, setItemName] = useState("");
    const [metalcompositionArray, setMetalCompositionArray] = useState([]);

    useEffect( () => {
        console.log("getting mi details");

        instance.get(backendURL + `/api/querymi/` + localStorage.getItem("miUUID"))
            .then((res) => {
                const responseObj = JSON.parse(res.data.response);
                console.log("res data", responseObj);
                setItemName(responseObj.itemname);
                setMIUUID(responseObj.id);

            }).catch(error => {
            console.log("error while sending request", error);
        });

        console.log("getting mc details");

        instance.get(backendURL + `/api/querymcbymi/` + localStorage.getItem("miUUID"))
            .then((res) => {
                const responseArrayObj = JSON.parse(res.data.response);
                // console.log("res data", responseArrayObj);
                setMetalCompositionArray(responseArrayObj);

            }).catch(error => {
            console.log("error while sending request", error);



        });
    }, []);


    // useEffect( () => {
    //     console.log("getting mc details");
    //
    //     instance.get(backendURL + `/api/querymcbymi/` + localStorage.getItem("miUUID"))
    //         .then((res) => {
    //             const responseArrayObj = JSON.parse(res.data.response);
    //             console.log("res data mc", responseArrayObj);
    //             setMetalCompositionArray(responseArrayObj);
    //
    //         }).catch(error => {
    //         console.log("error while sending request", error);
    //
    //
    //     });
    //
    // }, []);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const onWrite = async(message) => {
        console.log("message", message);
        try {
            // if ('NDEFReader' in window) {
            console.log("ndef in window");
            const ndef = new window.NDEFReader();
            // This line will avoid showing the native NFC UI reader
            await ndef.scan();
            await ndef.write({records: [{recordType: "text", data: message}]});
            alert(`Value Saved!`);
            // }
            // else {
            //     console.log("ndef reader not in window");
            // }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs" style={{ }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />}
                        onClick={()=> navigate('/m/')}
                        color="primary"
                        style = {{
                            margin: "10px"
                        }}
                >
                    Back
                </Button>

                <CssBaseline />
                <h1>Metal Item Created</h1>
                {/*<div style = {{*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'center',*/}
                {/*    // // display: 'flex',*/}
                {/*    // fontSize: '20px',*/}
                {/*    // padding: '5px',*/}
                {/*}}>*/}
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }} ref ={componentRef}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={miUUID}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>

                    <h3>Metal Item ID: {miUUID}</h3>
                    <h3>Item Name: {itemname}</h3>
                    {metalcompositionArray.map((mcItem, index) => {
                        // console.log("mc item", mcItem.Record.name);
                        // console.log("mc item", mcItem.Record.percentage);

                        return (
                          <div>
                          <h3>Material Name: {mcItem.Record.name}</h3>
                          <h3>Material Percentage: {mcItem.Record.percentage}</h3>
                          </div>

                    )
                    })}
                    {/*<h3>Material Name: {metalpurity}</h3>*/}
                    {/*<h3>Material Percentage: {sourcename}</h3>*/}

                    <Button
                        type="submit"
                        // fullWidth
                        variant="contained"
                        color="primary"
                        style = {{
                            margin: "10px"
                        }}
                        onClick={handlePrint}
                    >
                        Print QR
                    </Button>

                    <Button
                        type="submit"
                        // fullWidth
                        variant="contained"
                        color="primary"
                        style = {{
                            margin: "10px"

                        }}
                        onClick={()=>onWrite(miUUID)}

                    >
                        Write NFC
                    </Button>
                </div>



            </Container>
        </div>

    );

}

const RecyclingFac = () => {

    let navigate = useNavigate();


    //Form
    const [miUUID, setmiUUID] = useState("");


    //Modal Dialog
    const [open, setOpen] = useState(false);
    const [pageContent, setPageContent] = useState("");

    // NFC scanner
    const [actions, setActions] = useState(null);
    const {scan, write} = actions || {};

    const actionsValue = {actions,setActions};
    function areFieldsEmpty() {
        if (miUUID !== "") {
            return false;
        } else {
            return true;
        }
    }
    const handleDialogClose = () => {
        setOpen(false);
        resetFields();
    };


    const resetFields = () => {
        setmiUUID("");

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handlesubmit");
        console.log("fields are %s %s %s", miUUID, );

        if (!areFieldsEmpty()) {

                instance.get(backendURL + `/api/querymi/` + miUUID)
                    .then(res => {
                        // console.log(res);
                        console.log(res.data);
                        console.log("response code is " , res.status);

                        if (res.status === 200) {
                            setPageContent("200");
                            setOpen(true);
                            navigate(`/rf/next`);
                            localStorage.setItem("miUUID", miUUID); // The returned data obj contains userId

                        }
                    }).catch(error => {
                    console.log("error while sending request", error);

                    // console.log("error while sending request", error.response.status);

                    if (error.code = "ERR_NETWORK") {
                        console.log("network error");
                        setPageContent("500");
                        setOpen(true);
                    } else {
                        setPageContent("admin")
                        setOpen(true);
                    }

                });

        } else {
            setPageContent("empty");
            setOpen(true);
        }
    }

    function renderDialogContent() {
        // console.log("pagecontent is ", pageContent);

        return (
            <Dialog style={{}}
                    fullWidth={true}
                    maxWidth={'lg'}
                    open={open}
                    onClose={ ()=> setOpen(false)}
            >
                <div style={{backgroundColor: '#DFE2D7',}}>
                    <DialogTitle sx={{marginBottom: -1,}}>
                        {pageContent === "500" ? (
                                <div style={{color: 'gray'}}>Cannot connect to network server</div>
                            )
                            : pageContent === "201" ? (
                                    <div style={{color: 'gray'}}>Record Created</div>
                                )
                                : pageContent === "empty" ? (
                                    <div style={{color: 'gray'}}>Empty fields</div>
                                ) : (
                                    <div style={{color: 'gray'}}>Something went wrong</div>
                                )
                        }
                    </DialogTitle>
                </div>
                <DialogContent>
                    {pageContent === "500" ? (
                        <div>
                            <p>There is a connection error to the network server. Please contact the administrator or try again later.</p>
                        </div>
                    ) : pageContent === "201" ? (
                            <div>
                                <p>Record has been successfully created.</p>
                            </div>
                        )
                        : pageContent === "empty" ? (
                            <div>
                                <p>Please fill in all fields before submitting.</p>
                            </div>
                        ) : (
                            <div>
                                <p>Please contact the administrator.</p>
                            </div>
                        )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpen(false)}>Okay</Button>
                </DialogActions>
            </Dialog>
        );

    }

    const Scan = () => {
        const [message, setMessage] = useState('');
        const [serialNumber, setSerialNumber] = useState('');
        const { actions, setActions} = useContext(ActionsContext);

        const scan = useCallback(async() => {
            // console.log("scan function");
            // console.log("actions is", actions.scan === "scanned");
            if (actions.scan === "scanned") {
                console.log("alr scanned, do nothing");
            } else {
                if ('NDEFReader' in window) {
                    try {
                        console.log("first thing in scan function");
                        const ndef = new window.NDEFReader();
                        await ndef.scan();

                        console.log("Scan started successfully.");
                        ndef.onreadingerror = () => {
                            console.log("Cannot read data from the NFC tag. Try another one?");
                        };

                        ndef.onreading = event => {
                            console.log("NDEF message read.");
                            onReading(event);
                            setActions({
                                scan: 'scanned',
                                write: null
                            });
                        };

                    } catch(error){
                        console.log(`Error! Scan failed to start: ${error}.`);
                    }
                } else {
                    console.log("ndef reader not in window");
                }
            }
        },[setActions]);

        const onReading = ({message, serialNumber}) => {
            console.log("onreading");
            setSerialNumber(serialNumber);
            for (const record of message.records) {
                switch (record.recordType) {
                    case "text":
                        console.log("record encoding", record);

                        const textDecoder = new TextDecoder(record.encoding);
                        setMessage(textDecoder.decode(record.data));
                        setmiUUID(textDecoder.decode(record.data));

                        console.log("record data is", textDecoder.decode(record.data));
                        buttonRef.current.click();
                        break;
                    case "url":
                        // TODO: Read URL record with record data.
                        break;
                    default:
                    // TODO: Handle other records with record data.
                }
            }
        };

        useEffect(() => {
            scan();
        }, [scan]);

        console.log("NFC Tag read successfully ", serialNumber, message);
        return(
            <>
                {actions.scan === 'scanned' ?
                    <div>
                        {/*<p>Serial Number: {serialNumber}</p>*/}
                        {/*<p>Message: {message}</p>*/}
                    </div>
                    :
                    <Scanner status={actions.scan}></Scanner> }
            </>
        );
    };
    const onHandleAction = (actions) =>{
        console.log("handle action scan");
        setActions({...actions});
    }


    const buttonRef = useRef(null)

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs" style={{ }}>
                <CssBaseline />
                <div style = {{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    fontSize: '20px',
                    padding: '5px',
                }}>
                    Scan Metal Item
                </div>
                <form

                    // className={useStyles.form}
                    noValidate
                    onSubmit={(e) => handleSubmit(e)}
                >

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="metalitemid"
                        label="Metal Item ID"
                        value={miUUID}
                        onChange={(e) => setmiUUID(e.target.value)}
                        size="normal"
                        InputProps={{ style: { fontSize: '20px' } }}
                        InputLabelProps={{ style: { fontSize: '20px' }, shrink: true, }}
                    />


                    <div style = {{
                        display: 'flex',
                        marginTop:'20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                            <Button
                                variant="contained"
                                color="primary"
                                style = {{
                                    marginRight: '5px',
                                }}
                                onClick={()=>onHandleAction({scan: 'scanning', write: null})}
                                className="btn">
                                Scan
                            </Button>
                        <ActionsContext.Provider value={actionsValue}>
                            {scan && <Scan/>}
                        </ActionsContext.Provider>
                        <Button
                            ref = { buttonRef }
                            type="submit"
                            // fullWidth
                            variant="contained"
                            color="primary"
                            style = {{
                                marginLeft: '5px',

                            }}
                        >
                            Submit
                        </Button>
                    </div>

                </form>
                {renderDialogContent()}

            </Container>
        </div>

    );

}

const RecyclingFacNext = () => {

    let navigate = useNavigate();


    //Form
    const [miUUID, setMIUUID] = useState("");
    const [itemname, setItemName] = useState("");
    const [metalcompositionArray, setMetalCompositionArray] = useState([]);

    useEffect(() => {


        instance.get(backendURL + `/api/querymi/` + localStorage.getItem("miUUID"))
            .then((res) => {
                const responseObj = JSON.parse(res.data.response);
                console.log("res data", responseObj);
                setItemName(responseObj.itemname);
                setMIUUID(responseObj.id);

            }).catch(error => {
            console.log("error while sending request", error);
        });

        instance.get(backendURL + `/api/querymcbymi/` + localStorage.getItem("miUUID"))
            .then((res) => {
                const responseArrayObj = JSON.parse(res.data.response);
                // console.log("res data", responseArrayObj);
                setMetalCompositionArray(responseArrayObj);

            }).catch(error => {
            console.log("error while sending request", error);



        });
    }, []);



    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs" style={{ }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />}
                        onClick={()=> navigate('/rf/')}
                        color="primary"
                        style = {{
                            margin: "10px"
                        }}
                >
                    Back
                </Button>

                <CssBaseline />
                <h2>Items will be auto sorted to its required category.</h2>

                <img src={image}      style={{ alignSelf: 'center' }}
                     width={250} height={250} alt="sorting" />

                <div style={{ height: "auto", margin: "0 auto", maxWidth: 420, width: "100%" }}>
                    <h2>Metal Item Details</h2>

                    <h3>Metal Item ID: {miUUID}</h3>
                    <h3>Item Name: {itemname}</h3>
                    {metalcompositionArray.map((mcItem, index) => {
                        // console.log("mc item", mcItem.Record.name);
                        // console.log("mc item", mcItem.Record.percentage);

                        return (
                            <div>
                                <h3>Material Name: {mcItem.Record.name}</h3>
                                <h3>Material Percentage: {mcItem.Record.percentage}</h3>
                            </div>

                        )
                    })}
                    {/*<h3>Material Name: {metalpurity}</h3>*/}
                    {/*<h3>Material Percentage: {sourcename}</h3>*/}
                    
                </div>



            </Container>
        </div>

    );

}


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mpv" element={<MetalProduction/>}/>
                <Route path="/mpv/print" element={<MetalProductionPrint/>}/>

                <Route path="/m" element={<Manufacturer/>}/>
                <Route path="/m/create" element={<ManufacturerCreate/>}/>
                <Route path="/m/print" element={<ManufacturerPrint/>}/>

                <Route path="/rf" element={<RecyclingFac/>}/>
                <Route path="/rf/next" element={<RecyclingFacNext/>}/>

                {/*<Route path="/addupcoming" element={<AddUpcoming />} />*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;