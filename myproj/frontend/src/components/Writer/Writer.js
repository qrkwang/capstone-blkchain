import React from 'react';
import './Writer.css';
import Save from '../SVGs/save';

const Writer = ({writeFn}) => {
    const [message, setMessage] = React.useState('');

    const onSave = (message) => {
        // e.preventDefault();
        console.log("message", message);
        console.log("onsave");
        writeFn(message);
        setMessage('');
    };

    return (
        <>
        <div>
            {()=> onSave("asdfasadfs")}
        </div>
    </>
    );
};

export default Writer;