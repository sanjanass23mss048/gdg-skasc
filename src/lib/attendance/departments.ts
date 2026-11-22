/** Attendance department groups used for check-in + roster segregation. */
export const departments = [
  "IT and Cognitive",
  "M.Sc SS and AIML",
  "B.Sc SS, B.Sc CS and M.Sc CS",
  "B.Sc DS and B.Sc CT",
  "BCA and CSA",
  "B.Sc ECS",
] as const

export type DepartmentName = (typeof departments)[number]

export function normalizeDepartment(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return "Unspecified"
  const match = departments.find((item) => item.toLowerCase() === trimmed.toLowerCase())
  return match ?? trimmed
}

export function groupByDepartment<T extends { department: string }>(rows: T[]) {
  const map = new Map<string, T[]>()
  for (const row of rows) {
    const key = normalizeDepartment(row.department)
    const list = map.get(key) ?? []
    list.push(row)
    map.set(key, list)
  }

  const order = new Map(departments.map((name, index) => [name, index]))

  return [...map.entries()]
    .map(([department, records]) => ({
      department,
      count: records.length,
      records: [...records].sort((a, b) => {
        const left = "name" in a ? String((a as { name: string }).name) : ""
        const right = "name" in b ? String((b as { name: string }).name) : ""
        return left.localeCompare(right)
      }),
    }))
    .sort((a, b) => {
      const left = order.get(a.department as DepartmentName) ?? 999
      const right = order.get(b.department as DepartmentName) ?? 999
      if (left !== right) return left - right
      return a.department.localeCompare(b.department)
    })
}
