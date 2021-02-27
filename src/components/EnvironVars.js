import React, { Fragment } from 'react';

const EnvironVars = () => {
    var env = process.env;
    return React.createElement(Fragment, {}, ...env)
};

export default EnvironVars;