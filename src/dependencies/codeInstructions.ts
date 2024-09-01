export function codeInstructions(): string {
  return `/*  
  Write your code snippets here.
  You can export any variable, function or jsx component from a cell.
  You can import from any PREVIOUS cell.
  Use cell id as the address for the import; 
  e.g. import {var1} from '_code_123456'.
  Feel free to change the order of the cells using the yellow buttons.
  You can delete any cell using the red button.
  You can use "_show" function to visualize any
  variable, function or jsx component in the preview segment of the current cell. 
  Every HTML of a preview-segment  contains a single <div> with the id of "root".
  */`;
}
