import { Box, Button, Slide, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

type ClipboardCopyProps = {
    title: string
    textToCopy: string
    afterCopyTitle?: string
}

const ClipboardCopy: React.FC<ClipboardCopyProps> = ({
    title,
    textToCopy,
    afterCopyTitle,
}) => {
    const [hasClicked, setHasClicked] = useState(false)
    const buttonRef = useRef(null)

    useEffect(() => {
        if (hasClicked) {
            setTimeout(() => setHasClicked(false), 2000)
        }
    }, [hasClicked])

    return (
        <Button
            variant="outlined"
            sx={{ display: 'block', overflow: 'hidden' }}
            onClick={() => {
                setHasClicked(true)
                navigator.clipboard.writeText(document.location.href)
            }}
            ref={buttonRef}
        >
            <Box flexDirection="column" display="flex" alignItems="center">
                <Slide
                    in={!hasClicked}
                    direction="down"
                    container={buttonRef.current}
                    mountOnEnter
                >
                    <Typography component="span">{title}</Typography>
                </Slide>
                <Slide
                    in={hasClicked}
                    direction="up"
                    mountOnEnter
                    container={buttonRef.current}
                    style={{
                        position: 'absolute',
                    }}
                >
                    <Typography component="span">
                        {afterCopyTitle ?? 'Kopierad!'}
                    </Typography>
                </Slide>
            </Box>
        </Button>
    )
}

export default ClipboardCopy
