import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Author } from "../../../types/Author";

interface Props {
  author: Author | null;
  closeModal: () => void;
  create: (author: Author) => void;
}

const initialState = {
  name: "",
  nationality: "",
};

export default function CreateAuthor(props: Props) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({ name: false, nationality: false });


  useEffect(() => {
    setForm(props?.author || initialState);
  }, [props?.author]);

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
          {props.author ? "Actualizar Autor" : "Crear Autor"}
        </DialogTitle>
        <DialogContent>
          {props.author && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.author.id}
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
            helperText={errors.name ? "El nombre del autor no puede estar vacío" : ""}
          />
          <TextField
            margin="dense"
            id="nationality"
            label="Nacionalidad"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.nationality}
            helperText={errors.nationality ? "La nacionalidad no puede estar vacía" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button
            onClick={() => {
              const validName = form.name.trim().length > 0;
              const validNationality = form.nationality.trim().length > 0;

              if (!validName || !validNationality) {
                setErrors({
                  name: !validName,
                  nationality: !validNationality,
                });
                return;
              }
              props.create({
                id: props.author ? props.author.id : "",
                name: form.name,
                nationality: form.nationality,
              })
            }}
            disabled={!form.name.trim() || !form.nationality.trim()}
          >
            {props.author ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}