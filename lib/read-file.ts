import * as XLSX from 'xlsx';
import pdf from 'pdf-parse';

export async function readFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  if (file.name.endsWith('.txt')) {
    return buffer.toString('utf-8');
  } 
  
  if (file.name.endsWith('.pdf')) {
    const pdfData = await pdf(buffer);
    return pdfData.text;
  }
  
  if (file.name.endsWith('.xlsx')) {
    const workbook = XLSX.read(buffer, {type: 'buffer', cellDates: true});
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd'
    });
    return JSON.stringify(jsonData);
  }
  
  throw new Error('Unsupported file type');
}
