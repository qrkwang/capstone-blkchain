import React from 'react';
import Writer from '../components/Writer/Writer';

const Write = () => {
    console.log("write function");
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
        <Writer writeFn={onWrite}/>
    );
};

export default Write;