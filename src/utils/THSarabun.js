import { jsPDF } from "jspdf";
import "jspdf-autotable";

// ข้อมูลฟอนต์ THSarabun ในรูปแบบ Base64
// คุณต้องใส่ข้อมูล Base64 ของฟอนต์จริงๆ แทนที่ "..."
const THSarabunFont = {
  normal: "BASE64_ENCODED_FONT_DATA_HERE", // ใส่ข้อมูล Base64 ของฟอนต์ THSarabun ปกติ
  bold: "BASE64_ENCODED_FONT_DATA_HERE",   // ใส่ข้อมูล Base64 ของฟอนต์ THSarabun ตัวหนา
};
export const applyTHSarabunFont = (doc) => {
  doc.addFileToVFS("THSarabun.ttf", THSarabunFont.normal);
  doc.addFont("THSarabun.ttf", "THSarabun", "normal");
  doc.addFileToVFS("THSarabun-Bold.ttf", THSarabunFont.bold);
  doc.addFont("THSarabun-Bold.ttf", "THSarabun", "bold");

  doc.setFont("THSarabun", "normal");
};