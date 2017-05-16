import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CustomToolbar from './components/CustomToolbar';

const App = () => (
  <MuiThemeProvider>
    <CustomToolbar title="Librecandy"/>
  </MuiThemeProvider>
);

export default App;
