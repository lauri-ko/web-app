import { useLazyQuery, gql } from '@apollo/client'
import shortid from 'shortid'
import { useEffect } from 'react'

const GET_TIMETABLE = (stopId, date) => gql`
  query {
    stop(id: "${stopId}") {
      id
      name
      stoptimesForServiceDate(date: "${date}") {
        pattern {
          name
          headsign
        }
        stoptimes {
          headsign
          serviceDay
          scheduledDeparture
        }
      }
    }
  }
  `

export default function Timetable({stopId, date}) {

  const [getTimetable, { called, loading, data }] = useLazyQuery(GET_TIMETABLE(stopId, date))

  console.log(loading)
  useEffect(() => {
    if(!called) {
      getTimetable()
    }
  }, [called, getTimetable])

  console.log(data)

  if(loading) {
    return <div>Loading...</div>
  } else if(called && !data) {
    <div>Error</div>
  } else {
    const stop = data?.stop
    const pattern = stop?.stoptimesForServiceDate[0].pattern
    const stoptimes = stop?.stoptimesForServiceDate[0].stoptimes.slice().sort((a, b) => a.scheduledDeparture - b.scheduledDeparture)

    let tableRows = []
    stoptimes?.reduce((row, stoptime) => {
      const serviceDay = stoptime.serviceDay
      const departure = stoptime.scheduledDeparture
      const date = new Date((serviceDay + departure) * 1000)
      const hour = date.getHours()
      const minute = date.getMinutes()
      if(!row){
        row.push(hour)
        row.push(minute)
        tableRows.push()
      } else if(row[0] === hour) {
        row.push(minute)
      } else {
        row = [hour, minute]
        tableRows.push(row)
      }
      return row
    }, [])

    const patternName = date

    return (
      <div>
        <h3>{stop?.name} to {pattern?.headsign}</h3>
        <table>
          <caption>{patternName}</caption>
          <tbody>
            {tableRows.map(row => <tr key={shortid.generate()}>
              {row.map(item => <td key={shortid.generate()}>{item}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
    )
  }
}