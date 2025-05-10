const XLSX = require('xlsx');

const parsePayrollFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  // Expecting: [ { email, salary } ]
  return data.map(row => ({
    email: row.email,
    salary: Number(row.salary),
  }));
};

module.exports = parsePayrollFile;
