import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import bgVector from "./vector.svg";
import FeatherIcon from "feather-icons-react";
import Home from "./views/home";
import AddMember from "./views/add-member";
import Member from "./views/member";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-700">
        <Link className="fixed top-0 left-0 ml-2 m-8 z-10" to="/">
          <FeatherIcon icon="arrow-left" />
        </Link>
        <div>
          <img src={bgVector} className="w-full" alt="decorative" />
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/add-member" exact>
              <AddMember />
            </Route>
            <Route path="/member/:mobile" exact>
              <Member />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
