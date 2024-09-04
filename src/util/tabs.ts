import { TabOverview } from "@/types/types";
import { getMinutes24hTime } from "./dates";

export function isTabActiveNow(tab: TabOverview) {
  const startDate = Date.parse(tab.start_date)
  const endDate = Date.parse(tab.end_date)
  const startMin = getMinutes24hTime(tab.daily_start_time)
  const endMin = getMinutes24hTime(tab.daily_end_time)

  const now = new Date()
  const time = now.getMinutes() + now.getHours() * 60;
  const day = now.setUTCHours(0, 0, 0, 0)

  return (day >= startDate && day <= endDate && time >= startMin && time <= endMin)
}
