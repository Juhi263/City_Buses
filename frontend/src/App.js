import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [buses, setBuses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalFetched, setTotalFetched] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const url = location
        ? `http://localhost:5000/api/buses?location=${location}&page=${page}&limit=${limit}`
        : `http://localhost:5000/api/buses?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();

      setBuses(data.data);
      setTotalFetched(data.data.length);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBuses();
  };

  return (
    <div className="App">
      <h1>Jodhpur City Buses</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter a location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {buses.length === 0 ? (
            <p>No buses found for the given location.</p>
          ) : (
            <>
              <div className="bus-list">
                {buses.map((bus, index) => (
                  <div key={index} className="bus-card">
                    <h3>Bus Number: {bus.busNumber}</h3>
                    <p><strong>From:</strong> {bus.from}</p>
                    <p><strong>To:</strong> {bus.to}</p>
                    <p><strong>Via:</strong> {bus.via.join(", ")}</p>
                    <p><strong>Distance:</strong> {bus.distance} km</p>
                  </div>
                ))}
              </div>

              <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  ⬅ Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next ➡
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
