import axios from "axios";
import { Task, tokenConfig } from "../../../typeDefinition";
import { Button } from "@mui/material";
import { useRef } from "react";
import "./taskCardComponentStyle.css";
import ProgressBar from "../ProgressBar/progressBarComponent";

export default function TaskCard(props: { task: Task, progressValue: Task | undefined}) {

    const controller = useRef<AbortController>(new AbortController());

    const HandleStart = (id: number) => {
        axios.post(`https://localhost:7269/TaskStatus/`, { taskId: id }, tokenConfig)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => console.log(e));
    }

    return (
        <div className="task-card">
            <div className="options-wrap">
                <div>Task Id: {props.task.id}</div>
                <div>Fibonacci Index: {props.task.index}</div>
                <div>Previous result: {props.task.active ? props.progressValue?.previousResult : props.task.previousResult}</div>
                <div className="tip">Result: {props.task.active ? props.progressValue?.result : props.task.result}
                {props.task.active ?
                    <span className="tip-text">This result is not final. For final result please click on Finished link and wait a bit.</span>
                : ""}</div>

                {props.task.percentage > 0 && !props.task.active ? <div>Percentage: {props.task.percentage}</div>:
                <div className="start">
                    {props.task.active ?
                    <div><ProgressBar value={props.progressValue?.percentage} /></div>
                    :
                    <Button onClick={async () => { HandleStart(props.task.id); }}>Start</Button>}
                </div>}
            </div>
        </div>
    );
}
