import { Task, tokenConfig } from "../../typeDefinition";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard/taskCardComponent";
import useInterval from "use-interval";

export default function TaskList(props: { tasks: Task[], setNotDoneTasks: () => void }) {
    const [shortPool, setShortPool] = useState<boolean>(false);
    const [tasksProgress, setTasksProgress] = useState<Task[]>([]);

    const GetActiveProgress = async () => {
        try{
            const response = await axios.get<Task[]>(`https://localhost:7269/TaskStatus/`, tokenConfig);
            const taskProgressData = response.data;
            console.log(taskProgressData)
            taskProgressData.length > 0? setShortPool(true) : setShortPool(false);
            setTasksProgress(taskProgressData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetActiveProgress();
    }, []);

    useInterval(async () => {
        await GetActiveProgress();
        console.log("short pool");
    }, shortPool ? 2000 : null);



    function findTaskProgressById(id: number) {
        return tasksProgress.find((task) => task.id === id);
    }

    return (
        <div className="task-card-wrap">
            {props.tasks.map(i =>
                <TaskCard task={i} progressValue={findTaskProgressById(i.id)} />)}
        </div>
    )
}
