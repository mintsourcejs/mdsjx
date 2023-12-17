
import PropTypes from "prop-types";
import React from "react";
import { MdxScopeContext } from "./MdxScopeContext.js";

export const MdxScopeProvider = ({ children, value }) => {
    return (
        <MdxScopeContext.Provider value={value}>
            {children}
        </MdxScopeContext.Provider>
    );
};

MdxScopeProvider.propTypes = {
    children: PropTypes.node
};
