const xlsx = require("xlsx");
const path = require("path");

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];

  // create first sheet (page)
  let workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  // add first sheet to the excel file (or to the workbook)
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);

  // create second sheet (page)
  // let workSheet2 = xlsx.utils.aoa_to_sheet(workSheetData);
  // add second sheet to the excel file (or to the workbook)
  // xlsx.utils.book_append_sheet(workBook, workSheet2, `${workSheetName}_2`);

  //   xlsx.writeFile(workBook, path.resolve(filePath));

  xlsx.writeFile(workBook, "test.xlsx");
};

const exportUsersToExcel = (
  users,
  workSheetColumnNames,
  workSheetName,
  filePath
) => {
  const data = users.map((user) => {
    return [user.id, user.name, user.age];
  });
  return exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = {
  exportUsersToExcel,
};
