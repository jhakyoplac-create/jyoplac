import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputPath = "C:/Users/Jhank Yoplac Cabrera/Documents/New project/cierre_caja_modelo.xlsx";

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Cierre diario");

sheet.getRange("A1:H1").merge();
sheet.getRange("A1").values = [["CM Odontologia Estetica - Cierre diario"]];
sheet.getRange("A1").format = { font: { bold: true, size: 16, color: "#17323d" } };

sheet.getRange("A3:H3").values = [["RESUMEN", "FECHA", "DETALLE", "METODO", "ORIGEN", "EFECTIVO", "YAPE / PLIN", "TRANSFERENCIA / TARJETA"]];
sheet.getRange("A4:H9").values = [
  ["INICIO DIA", "16/05/2026", "CAJA CHICA", "EFECTIVO", "CAJA GENERAL", 300, "", ""],
  ["PAGO", "16/05/2026", "JHAK PITER YOPLAC CABRERA", "EFECTIVO", "INGRESO", 50, "", ""],
  ["PAGO", "16/05/2026", "MAGHY CAROL TORRES LLANOS", "EFECTIVO", "INGRESO", 80, "", ""],
  ["PAGO", "16/05/2026", "JJJJJJJJ", "YAPE", "INGRESO", "", 80, ""],
  ["EGRESO", "16/05/2026", "COMPRAS DE LIMAS", "EFECTIVO", "INGRESO DEL DIA", -120, "", ""],
  ["EGRESO", "16/05/2026", "COMPRA X", "YAPE", "INGRESO DEL DIA", "", -80, ""],
];

sheet.getRange("A10:E10").merge();
sheet.getRange("A10").values = [["TOTALES"]];
sheet.getRange("F10:H10").formulas = [["=SUM(F4:F9)", "=SUM(G4:G9)", "=SUM(H4:H9)"]];

sheet.getRange("C12:D17").values = [
  ["CAJA CHICA", 300],
  ["INGRESO DE EFECTIVO", "=SUMIFS(F4:F9,A4:A9,\"PAGO\")"],
  ["INGRESO YAPE", "=SUMIFS(G4:G9,A4:A9,\"PAGO\")"],
  ["INGRESO TARJETA", "=SUMIFS(H4:H9,A4:A9,\"PAGO\")"],
  ["EGRESOS OPERATIVOS", "=SUM(F10:H10)-SUMIFS(F4:H9,A4:A9,\"PAGO\")"],
  ["CIERRE", "=D12+SUM(F10:H10)"],
];

sheet.getRange("A3:H3").format = { fill: "#e5f7fb", font: { bold: true, color: "#17323d" } };
sheet.getRange("A10:H10").format = { fill: "#f5fcfd", font: { bold: true } };
sheet.getRange("A3:H10").format = { borders: { all: { style: "Continuous", color: "#b7d4df" } } };
sheet.getRange("C12:D17").format = { borders: { all: { style: "Continuous", color: "#17323d" } } };
sheet.getRange("F4:H17").format.numberFormat = "S/ #,##0.00;S/ -#,##0.00;S/ -";
sheet.getRange("A:H").format.autofitColumns();

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
