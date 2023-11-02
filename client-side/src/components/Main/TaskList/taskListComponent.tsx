import { Task } from "../../typeDefinition";
import TaskCard from "./TaskCard/taskCardComponent";

export default function TaskList(props: Readonly<{ tasks: Task[] }>) {
    return (
        <div className="task-card-wrap">
            {props.tasks.map(i =>
                <TaskCard task={i} key={i.id}/>)}
        </div>
    )
}
