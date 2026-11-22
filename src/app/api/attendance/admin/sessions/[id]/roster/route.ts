import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/attendance/auth"
import { groupByDepartment } from "@/lib/attendance/departments"
import { buildDepartmentOdZip } from "@/lib/attendance/odForm"
import { getSessionById, listRecords } from "@/lib/attendance/store"

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { id } = await params
  const session = await getSessionById(id)
  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 })
  }

  const records = await listRecords(id)
  const byDepartment = groupByDepartment(records)
  const url = new URL(request.url)
  const format = url.searchParams.get("format")

  if (format === "csv") {
    const sorted = byDepartment.flatMap((group) => group.records)
    const lines = [
      "department,name,class,section,rollNo,collegeId,timing,distanceMeters,accuracy",
      ...sorted.map((record) =>
        [
          csv(record.department),
          csv(record.name),
          csv(record.studentClass ?? ""),
          csv(record.section ?? ""),
          csv(record.registerNumber),
          csv(record.email ?? ""),
          csv(record.checkedInAt),
          record.distanceMeters,
          record.accuracy,
        ].join(","),
      ),
    ]
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="attendance-${session.id}-by-department.csv"`,
      },
    })
  }

  if (format === "od") {
    const { buffer, filename } = await buildDepartmentOdZip(session, records)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  }

  return NextResponse.json({ session, records, byDepartment })
}

function csv(value: string): string {
  const safe = value.replaceAll('"', '""')
  return `"${safe}"`
}
