import axios from "axios";
import { Task, tokenConfig } from "../../../typeDefinition";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import "./taskCardComponentStyle.css";
import TaskProgressBar from "../ProgressBar/progressBarComponent";
import useInterval from "use-interval";

import { URL } from "../../../../index";

export default function TaskCard(props: { task: Task }) {
    const [shortPool, setShortPool] = useState<boolean>(false);
    const [progressValue, setProgressValue] = useState<Task>();

    const HandleStart = (id: number) => {
        axios.put(`${URL}/Task/`,{ taskId: id }, tokenConfig)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => console.log(e));
    }

    const HandleStop = (id: number) => {
        axios.patch(`${URL}/Task/StopTask/${id}`, { id: id } ,  tokenConfig)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => console.log(e));
    }

    const HandleDelete = (id: number) => {
        axios.delete(`${URL}/Task/${id}`,  tokenConfig)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => console.log(e));
    }

    const GetActiveProgress = async () => {
        try{
            const response = await axios.get<Task>(`${URL}/Task/${props.task.id}`, tokenConfig);
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

    useInterval(() => {
        GetActiveProgress();
    }, shortPool ? 3000 : null);

    return (
        <div className="task-card">
            <div className="options-wrap">
                <div>Task id: {props.task.id}</div>
                <div>Fibonacci Index: {props.task.index}</div>
                <div>Previous result: {props.task.active ? progressValue?.previousResult : props.task.previousResult}</div>
                <div className="tip">Result: {props.task.active ? progressValue?.result : props.task.result}
                {props.task.active &&
                <span className="tip-text">This result is not final. For final result please click on Finished link and wait a bit.</span>}</div>

                {props.task.percentage > 0 && !props.task.active ?
                <>
                    <div>Percentage: {props.task.percentage > 100 ? 100: Number((props.task.percentage).toFixed(1))}</div>
                    {props.task.percentage < 100 &&
                        <div className="start">
                            <Button onClick={ () => { HandleStart(props.task.id); }}>Continue</Button>
                            <Button onClick={ () => { HandleDelete(props.task.id); }}>Delete</Button>
                        </div>
                    }
                </>:
                <div className="start">
                    {props.task.active ?
                    <><TaskProgressBar value={progressValue == undefined? 0: progressValue?.percentage} />
                    <Button onClick={ () => { HandleStop(props.task.id); }}>Stop</Button></>
                    :
                    <Button onClick={ () => { HandleStart(props.task.id); }}>Start</Button>}
                    <Button onClick={ () => { HandleDelete(props.task.id); }}>Delete</Button>
                </div>}
            </div>
        </div>
    );
}
