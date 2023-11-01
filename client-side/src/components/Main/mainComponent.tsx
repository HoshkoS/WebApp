import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import "./mainComponentStyle.css";
import AddTaskModal from "./AddTaskModal/addTaskModalComponent";
import axios from "axios";
import { Task, tokenConfig } from "../typeDefinition";
import TaskList from "./TaskList/taskListComponent";
import LogoutIcon from "@mui/icons-material/Logout";
import CurrentTaskList from "./TaskList/CurrentTaskListComponent";
import FinishedTaskList from "./TaskList/FinishedTaskListComponent";

export enum TaskListType {
  current,
  finished
}

export default function Root(props: { listType: TaskListType }) {
  const [userTasks, setUserTasks] = useState<Task[] | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const token = localStorage.getItem("jwtToken");

  const tokenClaims = token? jwt_decode<{ name: string }>(`${token}`) : undefined;

  const setNotDoneTasks = async () => {
    await axios.get<Task[]>('https://localhost:7269/Task/?done=false', tokenConfig)
      .then(response => {
        setUserTasks(response.data);
        console.log(userTasks);
      })
      .catch(error => console.error(error));
  }
  const setDoneTasks = async () => {
    await axios.get<Task[]>('https://localhost:7269/Task/?done=true', tokenConfig)
      .then(response => {
        setUserTasks(response.data);
        console.log(userTasks);
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    setNotDoneTasks();
  }, [open]);

  useEffect(() => {
  }, [userTasks]);

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
