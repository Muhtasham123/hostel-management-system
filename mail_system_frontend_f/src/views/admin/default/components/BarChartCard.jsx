import {useState, useEffect, useContext} from "react"
import BarChart from "components/charts/BarChart";
import axios from "axios"
import {toast} from "react-toastify"
import {context} from "context"
import {BounceLoader} from "react-spinners"

const BarChartCard = () => {
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const {hostelContext} = useContext(context)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const normalizeData = (data)=>{
        const result = []
        for(let i = 6; i>=0; i--){
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().slice(0, 10)

            const found = data.find(d => d.date.slice(0, 10) === dateStr)

            result.push({
                date:dateStr,
                views:found ? found.views : 0
            })
        }
        return result
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const viewsRes = await axios.get(`http://localhost:4000/admin/dashboard/views/${hostelContext}`, { withCredentials: true })

            console.log(viewsRes.data.data)
            const result = normalizeData(viewsRes.data.data)
            setChartData(result)
            setLoading(false)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to fetch data")
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [hostelContext])

  return (
        !loading
        ?
      <div className="w-full h-full !z-5 relative rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">

        <div className="flex flex-row justify-between px-3 pt-2">
            <div>
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                    Views in past 7 days
                </h4>
            </div>
        </div>

          <BarChart chartData={ [
          {
              name: "Views",
              data: chartData.map((d)=> d.views),
              color: "#4318FF",
          },
        ]} 
        chartOptions={
                  {
                      chart: {
                          toolbar: {
                              show: false,
                          },
                      },
                     
                      tooltip: {
                          style: {
                              fontSize: "12px",
                              fontFamily: undefined,
                              backgroundColor: "#000000"
                          },
                          theme: 'dark',
                          onDatasetHover: {
                              style: {
                                  fontSize: "12px",
                                  fontFamily: undefined,
                              },
                          },
                      },
                      xaxis: {
                          categories: chartData.map(d => {
                              const date = new Date(d.date)
                              return `${date.getDate()} ${months[date.getMonth()]}`
                          }),
                          show: false,
                          labels: {
                              show: true,
                              style: {
                                  colors: "#A3AED0",
                                  fontSize: "14px",
                                  fontWeight: "500",
                              },
                          },
                          axisBorder: {
                              show: true,
                          },
                          axisTicks: {
                              show: false,
                          },
                      },
                      yaxis: {
                          show: true,
                          //color: "black",
                          labels: {
                              show: true,
                              style: {
                                  colors: "#A3AED0",
                                  fontSize: "14px",
                                  fontWeight: "500",
                              },
                          },
                      },

                      grid: {
                          borderColor: "rgba(163, 174, 208, 0.3)",
                          show: true,
                          yaxis: {
                              lines: {
                                  show: false,
                                  opacity: 0.5,
                              },
                          },
                          row: {
                              opacity: 0.5,
                          },
                          xaxis: {
                              lines: {
                                  show: false,
                              },
                          },
                      },
                      fill: {
                          type: "solid",
                          colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
                      },
                      legend: {
                          show: false,
                      },
                      colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
                      dataLabels: {
                          enabled: false,
                      },
                      plotOptions: {
                          bar: {
                              minHeight: 10,
                              borderRadius: 0,
                              columnWidth: "20px",
                          },
                      },
                      stroke: {
                          width: 4,
                      },
                  }
        } />
      </div>
      :
      <div className = "h-[40vh] flex items-center justify-center">
        <BounceLoader color="#0b24c7" />
      </div>
  )
}

export default BarChartCard