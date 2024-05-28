import styled from "styled-components"

export const StyledExample = styled.div`
  display: flex;

  .source-group {
    display: flex;
    flex-direction: column;
    min-width: 100px;
    padding: 24px;
    gap: 16px;
    border: 2px solid aqua;
  }

  .target-group {
    position: relative;
    width: 100%;
    height: 100%;
  }
`
