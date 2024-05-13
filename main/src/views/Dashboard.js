import React, { useState, useEffect } from "react";
import axios from "axios";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Table,
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
  getDashboard24HoursPerformanceChart,
  getDashboardEmailStatisticsChart,
} from "variables/charts.js";

const TopGames = () => {
  const [topGames, setTopGames] = useState([]);

  useEffect(() => {
      const fetchTopGames = async () => {
          const options = {
              method: "GET",
              url: "https://opencritic-api.p.rapidapi.com/game/popular",
              headers: {
                  "X-RapidAPI-Key": "3c99aef3d5msh31f7672d0c065e0p1ff393jsn201091075aa0",
                  "X-RapidAPI-Host": "opencritic-api.p.rapidapi.com",
              },
          };

          try {
              const response = await axios.request(options);
              const sortedTopGames = response.data
                  .sort((a, b) => b.topCriticScore - a.topCriticScore)
                  .slice(0, 12);
              setTopGames(sortedTopGames);
          } catch (error) {
              console.error(error);
          }
      };

      fetchTopGames();
  }, []);

  const openGameDetails = async (gameId) => {
      const options = {
          method: 'GET',
          url: `https://opencritic-api.p.rapidapi.com/game/${gameId}`,
          headers: {
              'X-RapidAPI-Key': '3c99aef3d5msh31f7672d0c065e0p1ff393jsn201091075aa0',
              'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
          }
      };

      try {
          const response = await axios.request(options);
          const gameDetails = response.data;
          if (gameDetails && gameDetails.url) {
              window.open(gameDetails.url, '_blank');
          } else {
              console.log("URL not found in the game details");
          }
      } catch (error) {
          console.error("Error fetching game details:", error);
      }
  };

  return (
      <div>
          <Table>
              <thead className="text-primary">
                  <tr>
                      <th>Name</th>
                      <th>Critic Score</th>
                      <th>Image</th>
                  </tr>
              </thead>
              <tbody>
                  {topGames.map((game) => (
                      <tr key={game._id}>
                          <td onClick={() => openGameDetails(game.id)} style={{ cursor: 'pointer' }}>
                              {game.name}
                          </td>
                          <td onClick={() => openGameDetails(game.id)} style={{ cursor: 'pointer' }}>
                              {game.topCriticScore ? `${game.topCriticScore.toFixed(2)} %` : ""}
                          </td>
                          <td onClick={() => openGameDetails(game.id)} style={{ cursor: 'pointer' }}>
                              {game.images.box.og ? (
                                  <img
                                      src={`https://img.opencritic.com/${game.images.box.og}`}
                                      alt={game.name}
                                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                                  />
                              ) : ""}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </Table>
      </div>
  );
};


function Dashboard() {
  const [memberData, setMemberData] = useState({
    returnedMembers: [],
    lostMembers: [],
    pendingMembers: [],
    rentedMembers: [],
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState({
    returnedRevenue: [],
    lostRevenue: [],
    pendingRevenue: [],
    rentedRevenue: [],
  });

  const [statusCounts, setStatusCounts] = useState(null);

  const [topGames, setTopGames] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: "#fbc658",
        backgroundColor: "transparent",
        pointBorderColor: "#fbc658",
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
        tension: 0.4,
      },
    ],
  });

  const [chartOptionsTop, setChartOptionsTop] = useState({
    plugins: {
      legend: { display: false },
    },
  });

  useEffect(() => {
    const fetchTopGames = async () => {
      const options = {
        method: "GET",
        url: "https://opencritic-api.p.rapidapi.com/game/popular",
        headers: {
          "X-RapidAPI-Key":
            "3c99aef3d5msh31f7672d0c065e0p1ff393jsn201091075aa0",
          "X-RapidAPI-Host": "opencritic-api.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const sortedTopGames = response.data
          .sort((a, b) => b.topCriticScore - a.topCriticScore)
          .slice(0, 12);
        setTopGames(sortedTopGames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopGames();
  }, []);

  const dashboard24HoursPerformanceChart = getDashboard24HoursPerformanceChart(
    monthlyRevenue.returnedRevenue,
    monthlyRevenue.lostRevenue,
    monthlyRevenue.pendingRevenue,
    monthlyRevenue.rentedRevenue
  );

  useEffect(() => {
    const fetchTotalMembers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/total-members");
        setStatusCounts(response.data);
        console.log("statusCounts: ", response.data);
      } catch (error) {
        console.error("Error fetching total members by status:", error);
      }
    };

    // Fetch status counts only if it's null
    if (!statusCounts) {
      fetchTotalMembers();
    }
  }, [statusCounts]);

  const sortStatusCounts = (counts) => {
    if (!counts) return null;

    const order = ["Pending", "Returned", "Lost", "Rented"];
    const sortedCounts = {};

    // Populate sortedCounts object based on the order
    order.forEach((key) => {
      if (counts.hasOwnProperty(key)) {
        sortedCounts[key] = counts[key];
      }
    });

    return sortedCounts;
  };

  const generateChartData = (statusCounts) => {
    if (!statusCounts) return null;

    const sortedCounts = sortStatusCounts(statusCounts);
    const labels = Object.keys(sortedCounts);
    const data = Object.values(sortedCounts);

    return {
      labels: labels,
      datasets: [
        {
          label: "Revenue",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ["#4acccd", "#ef8157", "#fcc468", "#e3e3e3"],
          borderWidth: 0,
          data: data,
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return label + ": " + value;
          },
        },
      },
    },
    maintainAspectRatio: false,
    pieceLabel: {
      render: "percentage",
      fontColor: ["white"],
      precision: 2,
    },
    scales: {
      y: {
        ticks: {
          display: false,
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        barPercentage: 1.6,
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    const fetchMembers = async (status) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/${status}-members`
        );
        setMemberData((prevState) => ({
          ...prevState,
          [`${status}Members`]: response.data,
        }));
      } catch (error) {
        console.error(`Error fetching ${status} members:`, error);
      }
    };

    ["returned", "lost", "pending", "rented"].forEach((status) =>
      fetchMembers(status)
    );
  }, []);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const statuses = ["returned", "lost", "pending", "rented"];
        const monthlyData = {
          returnedRevenue: [],
          lostRevenue: [],
          pendingRevenue: [],
          rentedRevenue: [],
        };

        for (const status of statuses) {
          const response = await axios.get(
            `http://localhost:3001/${status}-members-monthly`
          );
          const formattedData = Array.from({ length: 12 }, (_, index) => {
            const monthData = response.data.find(
              (item) => item.month === index + 1
            );
            // Check if monthData exists and has counts for the status
            return monthData
              ? monthData.counts[
                  status.charAt(0).toUpperCase() + status.slice(1)
                ] || 0
              : 0;
          });

          monthlyData[`${status}Revenue`] = formattedData;
        }

        setMonthlyRevenue(monthlyData);
      } catch (error) {
        console.error("Error fetching monthly revenue data:", error);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  const calculateRevenue = (members) => {
    return members.reduce(
      (total, member) => total + parseFloat(member.stock.price),
      0
    );
  };

  // gi kuha sa server ang result mao ng na ing ana sya
  const getTotalRevenue = () => calculateRevenue(memberData.returnedMembers);
  const getLostRevenue = () => calculateRevenue(memberData.lostMembers);
  const getPendingRevenue = () => calculateRevenue(memberData.pendingMembers);
  const getRentedRevenue = () => calculateRevenue(memberData.rentedMembers);

  // katung naa sa taas
  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Pending</p>
                      <CardTitle tag="p">
                        &#8369;{getPendingRevenue()}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Returned Revenue</p>
                      <CardTitle tag="p">&#8369;{getTotalRevenue()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Lost Revenue</p>
                      <CardTitle tag="p">&#8369;{getLostRevenue()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Rented Revenue</p>
                      <CardTitle tag="p">&#8369;{getRentedRevenue()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Users Behavior</CardTitle>
                <p className="card-category">Monthly Performance</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        
        <Row>
          <Col md="4">
            {statusCounts && (
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Games Statistics</CardTitle>
                  <p className="card-category">statistic</p>
                </CardHeader>
                <CardBody style={{ height: "266px" }}>
                  <Pie
                    data={generateChartData(statusCounts)}
                    options={chartOptions}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" /> Pending{" "}
                    <i className="fa fa-circle text-warning" /> Returned{" "}
                    <i className="fa fa-circle text-danger" /> Lost{" "}
                    <i className="fa fa-circle text-gray" /> Rented
                  </div>
                  <hr />
                </CardFooter>
              </Card>
            )}
          </Col>

          <Col md="8">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Top Games</CardTitle>
                <p className="card-category">
                  Top 12 games based on topCriticScore
                </p>
              </CardHeader>
              <CardBody>
                <TopGames />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="card-stats">
                  <i className="fa fa-check" /> Data information certified
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
