import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

type PostMenuProps = {
    onDeletePost: () => void
}

const PostMenu: React.FC<PostMenuProps> = ({ onDeletePost }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const deletePost = () => {
        handleClose()
        onDeletePost()
    }

    return (
        <>
            <IconButton
                id="post-menu-button"
                aria-controls="post-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="post-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'post-menu-button',
                }}
            >
                <MenuItem onClick={deletePost} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ marginRight: 1 }} /> Ta bort
                </MenuItem>
            </Menu>
        </>
    )
}

export default PostMenu
