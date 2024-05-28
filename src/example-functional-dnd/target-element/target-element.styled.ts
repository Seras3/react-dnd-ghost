import styled from "styled-components"

export type StyledTargetElementProps = {
  variant: "t1" | "t2"
}

export const StyledTargetElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["variant"].includes(prop),
})<StyledTargetElementProps>`
  ${({ variant }) => {
    const renderVariantStyle = () => {
      switch (variant) {
        case "t1":
          return `
            background-color: #0d5b69;

            &.drag-over {
              background-color: #03282f;
            }
          `
        case "t2":
          return `
            background-color: #092b59;

            &.drag-over {
              background-color: #0c6cea;
            }
          `
      }
    }

    return ` 
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 2px solid slateblue;
      border-radius: 8px;

      ${renderVariantStyle()}
    `
  }}
`
