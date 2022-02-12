import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  display: flex;
  flex: 1;
  padding: 2rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.268);
  justify-content: center;
  align-items: center;
  height: 10vh;
  font-size: var(--font-size-2);
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
`;
const Footer: React.FC = () => {
  return <StyledFooter>Built by Emil Tayeb ©</StyledFooter>;
};

export default Footer;
