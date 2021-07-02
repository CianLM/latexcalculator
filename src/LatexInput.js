import React from 'react'
import TextField from '@material-ui/core/TextField'
import { Typography } from '@material-ui/core';
//import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import evaluatex from 'evaluatex/dist/evaluatex'


class LatexInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: String.raw`\sin \left( \frac{\pi}{2} \right) + \sqrt{ \alpha \cdot b}`,//String.raw`u,v \in V \implies u + v \in V`,
            output: '4',
            variableinput: '\\alpha = \\frac{3}{2}\nb = 2*3',
            variables: {alpha:1.5, b:6},
        }
    }

      handleChange = (e) => {
        this.setState({
            value: e.target.value,
        },() => {
            this.setState({
                output: this.parse(this.state.value)
            })
        })
      }

      variableChange = (e) => {
          let str = e.target.value.split(' ').join('')
          let obj = {}
          str.split("\n").forEach(e => {
              let eq = e.split("=")

              try {
              obj[eq[0].split("\\").join('')] = evaluatex(eq[1],{},{latex: true})()
              console.log(eq[1])
              }
              catch {
                  obj[eq[0].split("\\").join('')] = 'Error'
              }
          });

          this.setState({
              variableinput: e.target.value,
              variables: obj,
          }, () => {
              this.setState({
                output: this.parse(this.state.value)
              })
          })
      }

      parse = (str) => {

          console.log(`Input: ${str}`)
          let result
          // variables beginning with "/" break evaluatex
          str = str.replace(/(\\)(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|chi|psi|omega)/g,'$2')
          
          // Trailling spaces break evaluatex
          while (str[str.length -1] === " ") {
            str = str.substring(0,str.length-1)
          }
          
          let constants = { "pi":Math.PI,"e": Math.E,}
          constants = {...constants,...this.state.variables}

          console.log(`Processed Input: ${str}`)
          console.log(`Constants object: `,constants)

        try{
            let evalfunc = evaluatex(str,constants,{latex: true})
            result = evalfunc()

            console.log(`Output: ${result}`)
        }
        catch (error) {
            console.log(error)
            result = false
        }
        return result
      }

      render() {
        return (<div>

            <form  noValidate autoComplete="off">
            <Typography variant="h6" component="h6">Input:</Typography>
                <TextField
                    id="multiline-latex-input"
                    label="LaTeX Input"
                    multiline
                    rows={4}
                    value={this.state.value}
                    onChange={this.handleChange}
                    variant="filled"
                    color="primary"
                    //fullWidth
                    size="medium"
                    
                />
            </form>
            
            <Typography variant="h6" component="h6">Variables Input:</Typography>

            <form noValidate autoComplete="off">
            <TextField
                    id="latexvariables"
                    label="LaTeX Variables"
                    value={this.state.variableinput}
                    multiline
                    rows={2}
                    onChange={this.variableChange}
                    variant="filled"
                    color="primary"
                    //fullWidth
                    size="small"
                />
            </form>

            <BlockMath math={JSON.stringify(this.state.variables).split("\"").join('').split("\\n").join()
            // For LaTeX rendering of the variables input
            .replace(/(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|chi|psi|omega)/g,'\\$1')} />
            
            {/* If the expression can be evaluated, the input+answer will be displayed, otherwise just the input.  */}
            <Typography variant="h6" component="h6"><InlineMath math="\LaTeX" /> Calculator<InlineMath math="^2" /> Output:</Typography>

            <BlockMath math={this.state.output ? `${this.state.value} = ${this.state.output}` : this.state.value} />

        </div>);
      }
}

export default LatexInput
