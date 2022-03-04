import styled from 'styled-components';

const StyledCard = styled.div`
  background: white;
  border: 1px solid black;
  flex: 1 1 20px;
  padding: 2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

export default Card;
