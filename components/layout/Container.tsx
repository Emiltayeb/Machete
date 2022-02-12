import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  min-height: 90vh;
  padding-inline: var(--size-3);
  padding-block-start: var(--size-3);
`;
const Container: React.FC = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default Container;
