import { NavLink, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { AppBar, Backdrop, Box, Button, Fade, Modal, Toolbar, Typography } from "@mui/material";
import "./mainComponentStyle.css";
import AddTaskModal from "./AddTaskModal/addTaskModalComponent";
import axios from "axios";
import { ProcessTask, tokenConfig } from "../types";
import TaskList from "./TaskList/taskListComponent";

export default function Root() {
  const navigate = useNavigate();
  const [userTasks, setUserTask] = useState<ProcessTask[] | undefined>();
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwtToken"));
  const [open, setOpen] = useState<boolean>(false);


  //const tokenClaims = jwt_decode<{ name: string, family_name: string }>(`${token ? token : ""}`);


  const [buttonState, setButtonState] = useState<boolean>(false);

  const setNotDoneTasks = async () => {
    await axios.get<ProcessTask[]>('https://localhost:7269/Process/?done=false', tokenConfig)
      .then(response => {
        setUserTask(response.data);
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
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
              <NavLink to="/" className="nav-button">
                Home
              </NavLink>
              <NavLink to="/history" className="nav-button">
                Previous tasks
              </NavLink>
            </Box>
            <NavLink to="/login" className="nav-button" onClick={() => { localStorage.removeItem("jwtToken") }}>Log out</NavLink>
          </Toolbar>
        </AppBar>
        <div className="add-task-container">
          <Button size="large" onClick={() => setOpen(true)}>New task</Button>
        </div>
        <AddTaskModal
          open={open}
          setOpen={setOpen}
        />
        {userTasks != undefined ?
          <>
            {<TaskList tasks={userTasks} setNotDoneTasks={setNotDoneTasks} />}
          </>
          : <div className="task-info">
            <h1>You have no active tasks.<br />Let's add them.</h1>
          </div>
        }
      </Box>
    </div>
  );
}
