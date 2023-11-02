import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { AppBar, Box, Toolbar } from "@mui/material";
import "./mainComponentStyle.css";
import LogoutIcon from "@mui/icons-material/Logout";
import CurrentTaskList from "./TaskList/CurrentTaskList/CurrentTaskListComponent";
import FinishedTaskList from "./TaskList/FinishedTaskList/FinishedTaskListComponent";

export enum TaskListType {
  current,
  finished
}

export default function Root(props: Readonly<{ listType: TaskListType }>) {
  const token = localStorage.getItem("jwtToken");

  const tokenClaims = token? jwt_decode<{ name: string }>(`${token}`) : undefined;

  return (
    <div className="menu-container">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="navbar">
              <NavLink to="/" className="nav-button">
                Current
              </NavLink>
              <NavLink to="/finished" className="nav-button">
                Finished
              </NavLink>

            <NavLink className="nav-button" to="/login"onClick={() => { localStorage.removeItem("jwtToken") }}>
              <LogoutIcon sx={{color:'white'}}/>
            </NavLink>
            <div className="name-info">
              {token && `${tokenClaims?.name}`}
            </div>

          </Toolbar>
        </AppBar>

        {props.listType == TaskListType.current ?
            <CurrentTaskList /> : <FinishedTaskList />
        }
      </Box>
    </div>
  );
}
