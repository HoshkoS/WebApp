import { useEffect, useState } from "react";
import "../mainComponentStyle.css";
import axios from "axios";
import { Task, tokenConfig } from "../../typeDefinition";
import TaskList from "./taskListComponent";

export default function FinishedTaskList() {
  const [userTasks, setUserTasks] = useState<Task[] | undefined>();
  const [open, setOpen] = useState<boolean>(false);

  const setDoneTasks = async () => {
    await axios.get<Task[]>('https://localhost:7269/Task/?done=true', tokenConfig)
      .then(response => {
        setUserTasks(response.data);
        console.log(userTasks);
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    setDoneTasks();
  }, [open]);

  useEffect(() => {
  }, [userTasks]);

  return (<>
    { userTasks != undefined ?
    <>
      {<TaskList tasks={userTasks} setNotDoneTasks={setDoneTasks} />}
    </> :
    <div className="task-info">
      <h1>You have no finished tasks.<br />Please create new or start existing ones.</h1>
    </div>
    }
    </>
  );
}
