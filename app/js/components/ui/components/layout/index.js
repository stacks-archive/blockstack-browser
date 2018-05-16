import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
`;

const Panels = styled.div`
  display: flex;

  ${Panel} {
    width: ${({panels}) => 100 / panels}%;
  }
`;

const Rule = styled.hr`
  display: block;
  background-color: rgba(39, 15, 52, 0.1);
  border:0;
  height: 1px;
  width: 100%;
`;

export { Panels, Panel, Rule };
