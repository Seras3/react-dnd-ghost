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
  background-color: purple;
  border-radius: 20px;
  padding: 40px;
  color: white;
`

export const StyledGhost2 = styled.div`
  background-color: pink;
  border-radius: 20px;
  padding: 40px;
  color: black;
`
