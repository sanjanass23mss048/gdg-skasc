import { readFileSync } from "fs"
import { join } from "path"
import JSZip from "jszip"
import type { AttendanceRecord, AttendanceSession } from "@/lib/attendance/types"
import { groupByDepartment } from "@/lib/attendance/departments"

const CELL_WIDTHS = ["994", "1373", "2511", "1373", "1212", "1015", "1710"] as const

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function sanitizeFilePart(value: string, maxLength = 80): string {
  return value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLength) || "department"
}

/** Prefer the short event label before "|" so filenames stay readable. */
function shortEventSlug(title: string, fallbackId: string): string {
  const head = title.split("|")[0]?.trim() || title.trim() || fallbackId
  return sanitizeFilePart(head, 32)
}

function formatOdDate(iso: string | null | undefined): string {
  const date = iso ? new Date(iso) : new Date()
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function classLabel(record: AttendanceRecord): string {
  const base = (record.studentClass || "").trim()
  const section = (record.section || "").trim()
  if (base && section) return `${base} ${section}`
  return base || section
}

function textCell(width: string, text: string): string {
  return (
    `<w:tc>` +
    `<w:tcPr><w:tcW w:w="${width}" w:type="dxa" /><w:vAlign w:val="center" /></w:tcPr>` +
    `<w:p>` +
    `<w:pPr><w:jc w:val="center" /><w:rPr>` +
    `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" />` +
    `<w:sz w:val="22" /></w:rPr></w:pPr>` +
    `<w:r><w:rPr>` +
    `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" />` +
    `<w:sz w:val="22" /></w:rPr>` +
    `<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>` +
    `</w:p></w:tc>`
  )
}

function dataRow(cells: string[]): string {
  return (
    `<w:tr>` +
    `<w:trPr><w:trHeight w:val="420" /><w:jc w:val="center" /></w:trPr>` +
    cells.map((text, index) => textCell(CELL_WIDTHS[index] ?? "1000", text)).join("") +
    `</w:tr>`
  )
}

function buildStudentRows(records: AttendanceRecord[], session: AttendanceSession): string {
  const eventDate = formatOdDate(session.activatedAt || session.createdAt)
  const purpose = session.eventTitle || "GDG SKASC event"

  if (records.length === 0) {
    return dataRow(["", "", "", "", eventDate, "1", purpose])
  }

  return records
    .map((record, index) =>
      dataRow([
        String(index + 1),
        record.registerNumber || "",
        record.name || "",
        classLabel(record),
        formatOdDate(record.checkedInAt) || eventDate,
        "1",
        purpose,
      ]),
    )
    .join("")
}

function replaceDataRows(documentXml: string, studentRowsXml: string): string {
  const tableMatch = documentXml.match(/<w:tbl[\s\S]*?<\/w:tbl>/)
  if (!tableMatch) {
    throw new Error("OD form template is missing the exemption table.")
  }

  const tableXml = tableMatch[0]
  const rows = [...tableXml.matchAll(/<w:tr[\s\S]*?<\/w:tr>/g)].map((match) => match[0])
  if (rows.length < 2) {
    throw new Error("OD form template table does not have a header and data row.")
  }

  const headerRow = rows[0]
  const rebuiltTable = tableXml.replace(
    /(<w:tr[\s\S]*?<\/w:tr>)([\s\S]*)(<\/w:tbl>)/,
    (_full, _header, _rest, closeTbl: string) => `${headerRow}${studentRowsXml}${closeTbl}`,
  )

  return documentXml.replace(tableXml, rebuiltTable)
}

async function loadTemplateZip(): Promise<JSZip> {
  const templatePath = join(process.cwd(), "templates", "od-form.docx")
  const bytes = readFileSync(templatePath)
  return JSZip.loadAsync(bytes)
}

export async function buildOdFormDocx(
  session: AttendanceSession,
  records: AttendanceRecord[],
): Promise<Buffer> {
  const zip = await loadTemplateZip()
  const documentFile = zip.file("word/document.xml")
  if (!documentFile) {
    throw new Error("OD form template is missing word/document.xml.")
  }

  const documentXml = await documentFile.async("string")
  const filledXml = replaceDataRows(documentXml, buildStudentRows(records, session))
  zip.file("word/document.xml", filledXml)

  const output = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  })
  return Buffer.from(output)
}

export async function buildDepartmentOdZip(
  session: AttendanceSession,
  records: AttendanceRecord[],
): Promise<{ buffer: Buffer; filename: string }> {
  const groups = groupByDepartment(records)
  const zip = new JSZip()
  const eventSlug = shortEventSlug(session.eventTitle || "", session.id)

  for (const group of groups) {
    const docx = await buildOdFormDocx(session, group.records)
    const deptSlug = sanitizeFilePart(group.department, 48)
    // Department first so Windows file lists stay distinguishable when truncated.
    zip.file(`OD-${deptSlug}-${eventSlug}.docx`, docx)
  }

  if (groups.length === 0) {
    const empty = await buildOdFormDocx(session, [])
    zip.file(`OD-empty-${eventSlug}.docx`, empty)
  }

  const buffer = Buffer.from(
    await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    }),
  )

  return {
    buffer,
    filename: `od-forms-${sanitizeFilePart(session.id)}-by-department.zip`,
  }
}
