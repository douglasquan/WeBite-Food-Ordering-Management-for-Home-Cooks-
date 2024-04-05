// TransitionWrapper.jsx

import React from "react";
import { CSSTransition } from "react-transition-group";
import "./TransitionStyles.css"; // Import your CSS transitions

const TransitionWrapper = ({ children, locationKey }) => {
  return (
    <CSSTransition key={locationKey} classNames='fade' timeout={300}>
      {children}
    </CSSTransition>
  );
};

export default TransitionWrapper;
