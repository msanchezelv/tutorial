import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Client } from "../../../types/Client";

interface Props {
  client: Client | null;
  closeModal: () => void;
  create: (client: Client) => void;
}

const initialState = {
  name: "",
};

export default function CreateClient(props: Props) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({ name: false });

  useEffect(() => {
    setForm(props?.client || initialState);
  }, [props?.client]);

  const handleChangeForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setForm({
      ...form,
      [id]: value,
    });
  
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {props.client ? "Actualizar Cliente" : "Crear Cliente"}
        </DialogTitle>
        <DialogContent>
          {props.client && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.client.id}
              variant="standard"
            />
          )}
          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.name}
            helperText={errors.name ? "El nombre del cliente no puede estar vacío" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button
            onClick={() => {
              const validName = form.name.trim().length > 0;              

              if (!validName) {
                setErrors({
                  name: !validName,
                });
                return;
              }
              props.create({
                id: props.client ? props.client.id : "",
                name: form.name,
              })
            }}
            disabled={!form.name}
          >
            {props.client ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}