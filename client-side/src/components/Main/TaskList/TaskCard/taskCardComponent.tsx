import axios from "axios";
import { Task, tokenConfig } from "../../../typeDefinition";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import "./taskCardComponentStyle.css";
import ProgressBar from "../ProgressBar/progressBarComponent";
import useInterval from "use-interval";

export default function TaskCard(props: { task: Task }) {
    const [cancelToken, SetCancelToken] = useState<any>();
    const [shortPool, setShortPool] = useState<boolean>(false);
    const [progressValue, setProgressValue] = useState<Task>();

    const HandleStart = (id: number) => {
        axios.post(`https://localhost:44367/TaskStatus/`, { taskId: id }, tokenConfig)
            .then(res => {
                SetCancelToken(res.data);
                console.log(res.data);
            })
            .catch(e => console.log(e));
    }

    const HandleStop = (id: number) => {
        axios.put(`https://localhost:44367/TaskStatus/`, tokenConfig)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => console.log(e));
    }
    const GetActiveProgress = async () => {
        try{
            const response = await axios.get<Task>(`https://localhost:44367/TaskStatus/${props.task.id}`, tokenConfig);
            const taskProgressData = response.data;
            console.log(taskProgressData)
            taskProgressData != undefined ? setShortPool(true) : setShortPool(false);
            setProgressValue(taskProgressData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetActiveProgress();
            if (progressValue != undefined && progressValue?.percentage >= 100) {
                setProgressValue(undefined);
            }
    }, []);

    useInterval(async () => {
        await GetActiveProgress();
    }, shortPool ? 2000 : null);

    return (
        <div className="task-card">
            <div className="options-wrap">
                <div>Task id: {props.task.id}</div>
                <div>Fibonacci Index: {props.task.index}</div>
                <div>Previous result: {props.task.active ? progressValue?.previousResult : props.task.previousResult}</div>
                <div className="tip">Result: {props.task.active ? progressValue?.result : props.task.result}
                {props.task.active ?
                    <span className="tip-text">This result is not final. For final result please click on Finished link and wait a bit.</span>
                : ""}</div>

                {props.task.percentage > 0 && !props.task.active ? <><div>Percentage: {(props.task.percentage > 100 ? 100: props.task.percentage)}</div>{props.task.percentage < 100 ? <div className="start"><Button onClick={ () => { HandleStart(props.task.id); }}>Continue</Button></div>: ""} </>:
                <div className="start">
                    {props.task.active ?
                    <div><ProgressBar value={progressValue == undefined? 0: progressValue?.percentage} /><Button onClick={ () => { HandleStop(props.task.id); }}>Stop</Button></div>
                    :
                    <Button onClick={ () => { HandleStart(props.task.id); }}>Start</Button>}
                </div>}
            </div>
        </div>
    );
}