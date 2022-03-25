import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export interface MarkerProps {
  markerState: {
    directions: DOMRect;
    offset: number;
    functionality?: 'add' | 'remove';
  };
  onMarkerClick: any;
}

const StyledFloatingMenu = styled.div<MarkerProps | any>`
  position: absolute;
  top: ${({ position }) =>
    position ? position.bottom + window.pageYOffset + 4 : -10000}px;
  left: ${({ position }) =>
    position ? position.left + window.pageXOffset - 5 : -1000}px;
  z-index: 100;

  & button {
    background: ${({ state }) =>
    state === 'add' ? `var(--green-5)` : `var(--red-5)`};
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.5s ease;
    user-select: none;
    &:hover {
      background: white;
      color: var(--green-5);
    }
  }
`;

const Marker: React.FC<MarkerProps> = ({ markerState, onMarkerClick }) => {
  if (!window || typeof window === undefined) return <></>
  return ReactDOM.createPortal(
    <StyledFloatingMenu
      data-editor-marker='true'
      position={markerState.directions}
      state={markerState.functionality}
      onClick={onMarkerClick}>
      <button type='button'>
        {markerState.functionality === 'add' ? '+' : '-'}
      </button>
    </StyledFloatingMenu>,
    document.body
  );
};

export default Marker;
