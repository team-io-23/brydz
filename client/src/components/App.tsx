import React from 'react';
import StartPage from './StartPage/StartPage';
import Room from './Room/Room';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const theme = createTheme();
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path = "/"       element = {<StartPage/>}/>
            <Route path = "*"       element = {<StartPage/>}/>
            <Route path = "/room"   element = {<Room/>}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CssBaseline>

  );
}

export default App;
