import { Box, Button, Input, Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BasicModal({ props, clos, data, update }) {
  const [newFinishHour, setNewFinishHour] = useState("");

  const updateHours = (id) => {
    axios
      .put("http://localhost:3001/update", {
        id: id,
        newFinishHour: newFinishHour,
      })
      .then(() => update())
      .catch((error) => {
        console.log("Erro de cu doce", error);
      });
  };

  return (
    <Modal
      open={props}
      onClose={clos}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {data.date}
        </Typography>
        <p>
          Hora de saída: <span>{data.finishHour}</span>
        </p>
        <Input
          type="text"
          placeholder="Nova saída..."
          onChange={(event) => {
            setNewFinishHour(event.target.value);
          }}
        />
        <Button onClick={() => updateHours(data._id)}>Update</Button>
      </Box>
    </Modal>
  );
}

export default BasicModal;
