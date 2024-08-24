import React from 'react';

export const partial = (Component, props) => ({ children }) => (
  <Component {...props}>{children}</Component>
);

export const pipeComponents = (...components) => {
  return components.reduce((Acc, Cur) => {
    return ({ children }) => (
      <Acc>
        <Cur>{children}</Cur>
      </Acc>
    );
  });
};
