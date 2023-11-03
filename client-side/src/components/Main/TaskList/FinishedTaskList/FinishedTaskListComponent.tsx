import { useEffect, useState } from "react";
import "../../mainComponentStyle.css";
import axios from "axios";
import { Task, tokenConfig } from "../../../typeDefinition";
import TaskList from "../taskListComponent";
import useInterval from "use-interval";
import { URL } from "../../../../index";

export default function FinishedTaskList() {
  const [userTasks, setUserTasks] = useState<Task[] | undefined>();

  const setDoneTasks = async () => {
    await axios.get<Task[]>(`${URL}/Task/?done=true`, tokenConfig)
      .then(response => {
        setUserTasks(response.data);
        console.log(userTasks);
      })
      .catch(error => console.error(error));
  }
  useEffect(() => {
    setDoneTasks();
  }, []);

  useInterval(() => {
    setDoneTasks();
  }, 4000);


  return (<>
    { userTasks != undefined && userTasks.length != 0 ?
    <TaskList tasks={userTasks} />
     :
    <div className="task-info">
      <h1>You have no finished tasks.<br />Please create new or start existing ones.</h1>
    </div>
    }
    </>
  );
}
