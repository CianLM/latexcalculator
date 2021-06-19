import { Typography } from '@material-ui/core';
import { InlineMath } from 'react-katex';
import './App.css';
//import Clock from './Clock'
import LatexInput from './LatexInput'

function App() {
  return (
    <div className="App" >
        <header className="App-header">
          {/* < Clock /> */}
          <Typography variant="h2" component="h1">
            <InlineMath math="\LaTeX" /> Calculator<InlineMath math="^2"/>
          </Typography>
            <div>
              < LatexInput />
            </div>
        </header>
    </div>
  );
}

export default App;