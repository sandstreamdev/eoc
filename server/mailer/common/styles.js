const styles = ({ maxWidth = 512 } = {}) => ({
  a: `color: #15c;
    text-decoration: none;`,
  body: `background-color: #E9ECF2; 
    padding: 16px;
    font-family: Roboto, 'ProximaNova-Regular', Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #627085;`,
  boxMain: `background-color: #fff;
    max-width: ${maxWidth}px;
    padding: 40px;
    width: 100%`,
  boxBottom: `background-color: #fff;
    max-width: ${maxWidth}px;
    padding: 16px 40px;
    margin-top: 8px;
    width: 100%`,
  footer: `margin-top: 8px;
    line-height: 18px;
    font-size: 12px;`,
  h2: 'margin-top: 0',
  h4: `font-size: 16px;
    margin-bottom: 4px;
    margin-top: 16px;`,
  h5: `font-size: 16px;
    font-weight: normal;
    margin-top: 4px;
    margin-bottom: 4px;
    padding-top: 4px;`,
  header: `font-size: 18px;
    font-weight: 700;
    color: #ef9b1f;
    letter-spacing: 1px;
    margin-bottom: 8px;`,
  inputButton: `background: #ef9b1f;
    border: 0;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    padding: 8px 16px;
    cursor: pointer;`,
  deleteButton: `background: #fc4a1a;
    border: 0;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    padding: 8px 16px;
    cursor: pointer;`,
  receiver: 'margin: 0;',
  tableContent: `border-spacing: 0;
    width: 100%`,
  tableData: `
    border-spacing: 0;
    width: 100%;`,
  tdContent: 'border-spacing: 0;',
  tdData: `text-align: left;
    padding: 8px;`,
  thData: `text-align: left;
    padding: 8px;
    background: #ef9b1f;
    color: white;`,
  trEven: 'background-color: #f8f8f8;',
  trOdd: 'background-color: #efefef'
});

module.exports = styles;
