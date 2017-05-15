import React from 'react';

class App extends React.Component {
   render() {
      return (
      <h2 class="mdc-typography--display2">Hello, Material Components!</h2>
      <div class="mdc-textfield" data-mdc-auto-init="MDCTextfield">
        <input type="text" class="mdc-textfield__input" id="demo-input">
        <label for="demo-input" class="mdc-textfield__label">Tell us how you feel!</label>
      </div>
   }
}

export default App;
