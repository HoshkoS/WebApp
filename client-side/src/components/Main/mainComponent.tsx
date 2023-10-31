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


export default function Root() {
  const [userTasks, setUserTask] = useState<Task[] | undefined>();
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwtToken"));
  const [open, setOpen] = useState<boolean>(false);


  //const tokenClaims = jwt_decode<{ name: string, family_name: string }>(`${token ? token : ""}`);


  const setNotDoneTasks = async () => {
    await axios.get<Task[]>('https://localhost:7269/Process/?done=false', tokenConfig)
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
              <NavLink to="/" className="nav-button">
                Current
              </NavLink>
              <NavLink to="/history" className="nav-button">
                Finished
              </NavLink>
            <NavLink className="nav-button" to="/login"onClick={() => { localStorage.removeItem("jwtToken") }}>
              <LogoutIcon sx={{color:'white'}}/>
            </NavLink>

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
          :
          <div className="task-info">
            <h1>You have no active tasks.<br />Please create them.</h1>
          </div>
        }
      </Box>
    </div>
  );
}
