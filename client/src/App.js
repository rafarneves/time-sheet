import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import BasicModal from "./Modal";

function App() {
  const [dia, setDia] = useState("");
  const [entrada, setEntrada] = useState("");
  const [saida, setSaida] = useState("");

  const [listDatas, setListDatas] = useState([]);
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState({});
  const handleOpen = (datos) => {
    setOpen(true);
    setDados(datos);
  };
  const handleClose = () => setOpen(false);

  function addZero(numb) {
    if (parseInt(numb) >= 0 && parseInt(numb) <= 9) {
      return "0" + parseInt(numb);
    }
    return numb;
  }

  function horasTrabalhadas(date1, date2, date3) {
    const data1 = moment(
      moment(`${date1} ${date2}`, "DD/MM/YYYY HH:mm")
    ).format("YYYY-MM-DD HH:mm");
    const data2 = moment(
      moment(`${date1} ${date3}`, "DD/MM/YYYY HH:mm")
    ).format("YYYY-MM-DD HH:mm");
    const final1 = moment(new Date(data1));
    const final2 = moment(new Date(data2));
    const duracaoHoras = moment.duration(final2.diff(final1)).asMinutes() / 60;
    const duracaoMinutos = parseInt(
      Math.round((duracaoHoras - parseInt(duracaoHoras)) * 60)
    );
    return (
      addZero(parseInt(duracaoHoras)) + ":" + addZero(parseInt(duracaoMinutos))
    );
  }

  // POST
  const addForm = () => {
    const postData = {
      date: dia,
      startHour: entrada,
      finishHour: saida,
    };

    axios
      .post("http://localhost:3001/insert", postData)
      .then((response) => {
        setListDatas([...listDatas, response.data]);
      })
      .catch((error) => {
        console.log("Erro de cu", error);
      });
  };

  const fetchData = () => {
    axios.get("http://localhost:3001/read").then((response) => {
      setListDatas(response.data);
    });
  };

  const deleteHour = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      fetchData();
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  // DELETE

  return (
    <div className="App">
      <h1>Crud app</h1>
      <label>Data:</label>
      <input
        type="text"
        value={dia}
        onChange={(event) => setDia(event.target.value)}
      />
      <label>Entrada:</label>
      <input
        type="text"
        value={entrada}
        onChange={(event) => setEntrada(event.target.value)}
      />
      <label>Saída:</label>
      <input
        type="text"
        value={saida}
        onChange={(event) => setSaida(event.target.value)}
      />
      <button className="btnSubmit" onClick={addForm}>
        Adicionar
      </button>
      <hr style={{ width: "100%", border: "1px solid rgba(0, 0, 0, 0.05)" }} />
      <TableContainer style={{ display: "flex", justifyContent: "center" }}>
        <Table sx={{ width: "60%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>Saída</TableCell>
              <TableCell>Horas trabalhadas</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listDatas.map((row) => {
              const rowId = row._id;
              return (
                <TableRow key={rowId}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.startHour}</TableCell>
                  <TableCell>{row.finishHour}</TableCell>
                  <TableCell>
                    {listDatas.length
                      ? horasTrabalhadas(
                          row.date,
                          row.startHour,
                          row.finishHour
                        )
                      : ""}
                  </TableCell>
                  <TableCell style={{ display: "flex" }}>
                    <IconButton onClick={() => handleOpen(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteHour(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <BasicModal
        props={open}
        clos={handleClose}
        data={dados}
        update={fetchData}
      />
    </div>
  );
}

export default App;
