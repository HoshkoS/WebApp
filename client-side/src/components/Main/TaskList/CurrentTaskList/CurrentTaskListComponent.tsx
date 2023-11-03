import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "../../mainComponentStyle.css";
import AddTaskModal from "../../AddTaskModal/addTaskModalComponent";
import axios from "axios";
import { Task, tokenConfig } from "../../../typeDefinition";
import TaskList from "../taskListComponent";
import useInterval from "use-interval";
import { URL } from "../../../../index";

export default function CurrentTaskList() {
  const [userTasks, setUserTasks] = useState<Task[] | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const setNotDoneTasks = async () => {
    await axios.get<Task[]>(`${URL}/Task/?done=false`, tokenConfig)
      .then(response => {
        setUserTasks(response.data);
        console.log(userTasks);
      })
      .catch(error => console.error(error));
  }
  useEffect(() => {
    setNotDoneTasks();
  }, []);
  useInterval(() => {
    setNotDoneTasks();
  }, 4000);

  return (<>
    {userTasks != undefined && userTasks?.length < 10 ?
    <div className="add-task-container">
      <Button size="large" onClick={() => setOpen(true)}>New task</Button>
    </div>
    :
    <div className="task-info">
      <h3>You reached your task  limit.<br />Please start existing ones or wait for others to finish.</h3>
    </div>
    }

    <AddTaskModal open={open} setOpen={setOpen} />
    { userTasks != undefined && userTasks.length != 0?
    <TaskList tasks={userTasks} />
    :
    <div className="task-info">
      <h1>You have no active tasks.<br />Please create them.</h1>
    </div>
    }
    </>
  );
}
