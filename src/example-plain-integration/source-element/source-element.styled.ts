import styled from "styled-components"

export const StyledSourceElement = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4444bb;
  color: white;

  &:hover {
    background-color: #5555bb;
    cursor: grab;
  }
`

export const StyledGhost1 = styled.div`
  color: black;
  background-color: lime;
  padding: 16px;
  border-radius: 16px;
`

export const StyledGhost2 = styled.div`
  color: black;
  background-color: aqua;
  padding: 8px;
  border-radius: 8px;
`
