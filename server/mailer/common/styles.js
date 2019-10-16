const styles = ({ maxWidth }) => ({
  a: `color: #15c;
    text-decoration: none;`,
  body: `background-color: #E9ECF2; 
    padding: 16px;
    font-family: 'ProximaNova-Regular', Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #627085;`,
  boxMain: `background-color: #fff;
    max-width: ${maxWidth}px;
    padding: 40px;
    width: 100%`,
  boxBottom: `background-color: #fff;
    max-width: ${maxWidth}px;
    padding: 16px;
    margin-top: 8px;
    width: 100%`,
  footer: `margin-top: 8px;
    line-height: 18px;
    font-size: 12px;`,
  h4: `font-size: 16px;
    margin-bottom: 4px;
    margin-top: 16px;`,
  h5: `font-size: 16px;
    font-weight: normal;
    margin-top: 4px;
    margin-bottom: 4px;`,
  header: `font-size: 18px;
    font-weight: 700;
    color: #ef9b1f;
    letter-spacing: 1px;
    margin-bottom: 8px;`,
  receiver: 'margin: 0;',
  tableContent: 'border-spacing: 0;',
  tableData: `
    border-spacing: 0;
    width: 100%;
    border: 1px solid lightgray;`,
  tdContent: 'border-spacing: 0;',
  tdData: `text-align: left;
    padding: 8px;`,
  thData: `text-align: left;
    padding: 8px;
    background: #ef9b1f;
    color: white;`,
  trOdd: 'background-color: #f2f2f2;'
});

module.exports = styles;
