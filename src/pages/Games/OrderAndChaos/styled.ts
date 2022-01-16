import { Box } from '@mui/material'
import styled from 'styled-components'

export const CellBox = styled(Box)<{ isHovering: boolean }>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-style: solid;
    margin: 0;
    flex: 1;
    ${(p) => p.isHovering && 'cursor: pointer'}
`

export const ContainerBox = styled(Box)`
    border-width: 2px;
    border-style: solid;
    &:after {
        content: '';
        display: block;
        padding-bottom: 100%;
    }
`

export const Marker = styled(Box)<{ color: string; ghost?: boolean }>`
    background-color: ${(p) => p.color};
    border-radius: 50%;
    border-width: 5px;
    border-style: solid;
    width: 90%;
    height: 90%;
    ${(p) =>
        p.ghost &&
        `
    opacity: 0.5;
    box-shadow: 0 0 6px ${p.color};
`};
`

export const SelectionMarker = styled(Marker)<{
    color: string
    isSelected: boolean
}>`
    width: 64px;
    height: 64px;
    cursor: pointer;

    ${(p) => !p.isSelected && `opacity: 0.5`};

    &:hover {
        /* opacity: 0.5; */
        box-shadow: 0 0 6px ${(p) => p.color};
    }
`
