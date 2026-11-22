/** Events that can open a live attendance session. */
export const attendanceEvents = [
  {
    id: "initiate-2026",
    title: "INITIATE | GDG on Campus SKASC Inauguration 2026–27",
    tag: "Upcoming",
  },
  {
    id: "techsprint-session-2",
    title: "TechSprint Session #2",
    tag: "Tech Talk",
  },
  {
    id: "techsprint-top-10",
    title: "GDG TechSprint 2025: Top 10 Teams Announcement",
    tag: "Hackathon",
  },
  {
    id: "solution-challenge-2026",
    title: "Solution Challenge 2026 Kickoff: Build with AI",
    tag: "Build with AI",
  },
  {
    id: "study-jam-swags",
    title: "Google Study Jam Swags Distribution",
    tag: "Cloud",
  },
  {
    id: "custom-session",
    title: "Custom / one-off session",
    tag: "Live",
  },
] as const

export type AttendanceEventId = (typeof attendanceEvents)[number]["id"]

export function findAttendanceEvent(id: string) {
  return attendanceEvents.find((event) => event.id === id)
}
