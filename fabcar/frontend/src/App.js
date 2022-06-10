import {
    BrowserRouter,
    Routes,
    Route,
    Link, useNavigate, Navigate
} from "react-router-dom";

const Home = () => {

  let navigate = useNavigate();

  return (
      <div>
      <p>Metal Production View </p>
      <p>Manufacturer View </p>
      <p>Recycling Facility View </p>

      </div>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />


                {/*<Route path="/addupcoming" element={<AddUpcoming />} />*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;