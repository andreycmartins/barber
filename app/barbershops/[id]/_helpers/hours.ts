import { addMinutes, format, setHours, setMinutes } from 'date-fns'

const generateDayTimeList = (date: Date): string[] => {
  const startTime = setMinutes(setHours(date, 9), 0)
  const endTime = setMinutes(setHours(date, 22), 0)
  const interval = 30
  const timeList: string[] = []

  let currentTime = startTime

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, 'HH:mm'))
    currentTime = addMinutes(currentTime, interval)
  }

  return timeList
}

export default generateDayTimeList
