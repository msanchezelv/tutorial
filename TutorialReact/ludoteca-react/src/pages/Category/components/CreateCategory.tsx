import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Category } from "../../../types/Category";

interface Props {
  category: Category | null;
  closeModal: () => void;
  create: (categtory: Category) => void;
}

const initialState = {
  name: "",
};




export default function CreateCategory(props: Props) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({ name: false});

  useEffect(() => {
    setForm(props?.category || initialState);
  }, [props?.category]);

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
          {props.category ? "Actualizar Categoría" : "Crear Categoría"}
        </DialogTitle>
        <DialogContent>
          {props.category && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.category.id}
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
            helperText={errors.name ? "El nombre de la categoría no puede estar vacío" : ""}
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
                id: props.category ? props.category.id : "",
                name: form.name,
              })
            }}
            disabled={!form.name.trim()}
          >
            {props.category ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

