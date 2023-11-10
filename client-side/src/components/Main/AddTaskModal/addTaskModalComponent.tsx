import { Backdrop, Box, Button, Fade, FormControl, FormLabel, Modal, TextField } from "@mui/material";
import "./addTaskModalComponentStyle.css";
import { Form } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { tokenConfig } from "../../typeDefinition";
import { GeneralURL } from "../../../index";

export default function AddTaskModal(props: { open: boolean, setOpen: (a: boolean) => void }) {
    const [index, setIndex] = useState<number>(1);

    const HandleIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIndex(Number(e.target.value));
    }

    const handleSubmit = async () => {
        try {
            await axios.post(`${GeneralURL}/Task/`, {
                index: index
            }, tokenConfig);
            props.setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={props.open}
            onClose={() => props.setOpen(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    TransitionComponent: Fade,
                },
            }}
        >
            <Fade in={props.open}>
                <Box className="modal-box">
                    <Form className="login-form" onSubmit={handleSubmit}>
                        <span className="form-title">Task params</span>
                        <FormControl required className="login-element">
                            <FormLabel>Input index of Fibonacci number</FormLabel>
                            <TextField
                                className="input-box"
                                size="small"
                                id="outlined-error"
                                label="1...10"
                                type="number"
                                inputProps={{
                                    min: 1,
                                    max: 50,
                                }}
                                autoComplete="off"
                                sx={{marginBottom:'10px'}}
                                onChange={HandleIndexChange}
                            />
                        </FormControl>
                        <Button type='submit' sx={{color: '#2e5250', fontWeight: '700'}}>
                            Submit
                        </Button>
                    </Form>
                </Box>
            </Fade>
        </Modal>
    )
}
