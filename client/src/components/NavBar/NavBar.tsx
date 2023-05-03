import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import './NavBar.css';


interface MenuOption_t {
  name: string;
  link: string;
}

interface Menu_t {
    buttonName: string;
    options: Array<MenuOption_t>;
}

function BasicMenu(props: Menu_t) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx = {{color: "white"}}
        >
          {props.buttonName}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
            {props.options.map((menuOption, key) => (
              <MenuItem onClick={handleClose}>
                <Link to={menuOption.link} style = {{color: "black", textDecoration: "none"}}>
                  {menuOption.name}
                </Link>
              </MenuItem>
            ))}
        </Menu>
      </div>
    );
  }

const pages = new Map<string, Array<MenuOption_t>>();
pages.set('Play', [{name: 'Random game', link: '/Room'}, {name: 'Go to room', link: '/'}]);

function NavBar() {
  return (
    <div className='NavBar'>
    <AppBar>
      <Container sx = {{minWidth: "100%"}}>
        <Toolbar disableGutters>          
          <Box sx={{flexGrow: 1, display: "flex"}}>
            {Array.from(pages, ([name, value]) => ({ name, value })).map((elem, key) =>
                <BasicMenu key = {key} buttonName = {elem.name} options = {elem.value}/>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
    </div>
  );
}
export default NavBar;