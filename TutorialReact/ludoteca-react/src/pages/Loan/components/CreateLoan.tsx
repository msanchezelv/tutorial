import { ChangeEvent, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Loan } from "../../../types/Loan";
import { LoaderContext } from "../../../context/LoaderProvider";
import { Client } from "../../../types/Client";
import { Game } from "../../../types/Game";
import { MenuItem } from "@mui/material";
import { useGetGamesQuery, useGetClientsQuery } from "../../../redux/services/ludotecaApi";

 interface Props {
    loan: Loan | null;
    closeModal: () => void;
    create: (loan: Loan) => void;
  }

  const initialState = {
    id: "",
    client: undefined,
    game: undefined,
    loanDate: '',
    returnDate: '',
    pageNumber: 0,
    pageSize: 5
  };

  export default function CreateLoan(props: Props) {
    const [form, setForm] = useState<Loan>(initialState);
    const [dateError, setDateError] = useState<string>(''); 
    const [gameError, setGameError] = useState<string>('');
    const loader = useContext(LoaderContext);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const { data: games, isLoading: isLoadingGames } = useGetGamesQuery({
      title: "",
      idCategory: ""
    });
    const { data: clients, isLoading: isLoadingClients } = useGetClientsQuery(null);

    useEffect(() => {
      if (props.loan) {
        setForm({
          id: props.loan?.id || "",
          client: props.loan?.client,
          game: props.loan?.game,
          loanDate: props.loan?.loanDate || '',
          returnDate: props.loan?.returnDate || '',
        });
      }
    }, [props?.loan]);

    useEffect(() => {
      loader.showLoading(isLoadingGames || isLoadingClients);
    }, [isLoadingGames, isLoadingClients]);

    const handleChangeForm = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm({
        ...form,
        [event.target.id]: event.target.value,
      });
      setDateError('');
      setGameError('');
    };

    const handleChangeSelect = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (event.target.name === "game") {
        const selectedGame = games?.find((game) => game.id === event.target.value);
        setForm({
          ...form,
          game: selectedGame,
        });
      } else if (event.target.name === "client") {
        const selectedClient = clients?.find((client) => client.id === event.target.value);
        setForm({
          ...form,
          client: selectedClient,
        });
      }
    };    

    const handleCreate = async () => {
      if (form.returnDate && form.loanDate) {
        const loanDate = new Date(form.loanDate);
        const returnDate = new Date(form.returnDate);
  
        if (isNaN(loanDate.getTime()) || isNaN(returnDate.getTime())) {
          setDateError("Las fechas proporcionadas no son válidas.");
          return;
        }
  
        const formattedLoanDate = loanDate.toISOString().split('T')[0];
        const formattedReturnDate = returnDate.toISOString().split('T')[0];
  
        if (returnDate < loanDate) {
          setDateError('La fecha de fin del préstamo no puede ser anterior a la fecha de inicio.');
          return;
        }
  
        const diffTime = Math.abs(returnDate.getTime() - loanDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
        if (diffDays > 14) {
          setDateError('El período de préstamo no puede ser superior a 14 días.');
          return;
        }
  
        if (!form.client) {
          setGameError("Debe seleccionar un cliente.");
          return;
        }

        const gameId = form.game?.id ? Number(form.game.id) : -1;

        if (gameId === -1) {
          setGameError("Debe seleccionar un juego.");
          return;
        }
  
        const clientId = form.client?.id ? Number(form.client.id) : -1;
  
        try {
          const hasExceededLoanLimit = await checkClientLoanLimit(clientId, formattedLoanDate, formattedReturnDate, pageNumber, pageSize);
  
          if (hasExceededLoanLimit) {
            setGameError('El cliente ya tiene un préstamo en alguna de estas fechas o el juego ya está prestado.');
            return;
          }

          const isGameLoaned = await checkIfGameIsLoaned(gameId, formattedLoanDate, formattedReturnDate, pageNumber, pageSize);
  
          if (isGameLoaned) {
            setGameError('El juego ya está prestado en estas fechas.');
            return;
          }
  
          const newLoan: Loan = {
            id: "",
            client: form.client,
            game: form.game!,
            loanDate: formattedLoanDate,
            returnDate: formattedReturnDate,
          };
  
          props.create(newLoan);
          props.closeModal();
        } catch (error: any) {
          console.error("Error during loan creation:", error);

          const errorMessage = error.message || 'Ocurrió un error al intentar crear el préstamo.';

          if (error.response) {
            try {
              const errorData = await error.response.json();
              setGameError(errorData.message || errorMessage);
            } catch (e) {
              setGameError(errorMessage);
            }
          } else {
            setGameError(errorMessage);
          }
        }
      }
    };

    const checkIfGameIsLoaned = async (
      gameId: number,
      loanDate: string,
      returnDate: string,
      pageNumber: number,
      pageSize: number
    ) => {
      const loanDateResponse = await fetch(`http://localhost:8080/loan?date=${loanDate}`, {
        method: 'POST',
        body: JSON.stringify({
          pageable: { pageNumber, pageSize }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    
      if (!loanDateResponse.ok) {
        const errorData = await loanDateResponse.json();
        const errorMessage = errorData.message || 'Error al consultar los préstamos';
        throw new Error(errorMessage); 
      }
    
      const loansStart = await loanDateResponse.json();
    
      const gameLoanedAtStart = loansStart.content.some((loan: any) => {
        const loanStart = new Date(loan.loanDate);
        const loanEnd = new Date(loan.returnDate);
        const newStart = new Date(loanDate);
    
        return loan.game.id === gameId && (newStart < loanEnd && newStart >= loanStart);
      });
    
      if (gameLoanedAtStart) {
        return true;
      }
    
      const returnDateResponse = await fetch(`http://localhost:8080/loan?date=${returnDate}`, {
        method: 'POST',
        body: JSON.stringify({
          pageable: { pageNumber, pageSize }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    
      if (!returnDateResponse.ok) {
        const errorData = await returnDateResponse.json();
        const errorMessage = errorData.message || 'Error al consultar los préstamos';
        throw new Error(errorMessage); 
      }
    
      const loansEnd = await returnDateResponse.json();
    
      const gameLoanedAtEnd = loansEnd.content.some((loan: any) => {
        const loanStart = new Date(loan.loanDate);
        const loanEnd = new Date(loan.returnDate);
        const newEnd = new Date(returnDate);
    
        return loan.game.id === gameId && (newEnd > loanStart && newEnd <= loanEnd);
      });
    
      if (gameLoanedAtEnd) {
        return true;
      }
    
      return false;
    };

    const checkClientLoanLimit = async (
      clientId: number,
      loanDate: string,
      returnDate: string,
      pageNumber: number,
      pageSize: number
    ) => {
      try {
        const loanDateResponse = await fetch(`http://localhost:8080/loan?idClient=${clientId}&date=${loanDate}`, {
          method: 'POST',
          body: JSON.stringify({
            pageable: { pageNumber, pageSize }
          }),
          headers: { 'Content-Type': 'application/json' }
        });
    
        if (!loanDateResponse.ok) {
          const errorData = await loanDateResponse.json();
          const errorMessage = errorData.message || 'Error al consultar los préstamos del cliente';
          throw new Error(errorMessage);
        }
    
        const loansStart = await loanDateResponse.json();
    
        const returnDateResponse = await fetch(`http://localhost:8080/loan?idClient=${clientId}&date=${returnDate}`, {
          method: 'POST',
          body: JSON.stringify({
            pageable: { pageNumber, pageSize }
          }),
          headers: { 'Content-Type': 'application/json' }
        });
    
        if (!returnDateResponse.ok) {
          const errorData = await returnDateResponse.json();
          const errorMessage = errorData.message || 'Error al consultar los préstamos del cliente';
          throw new Error(errorMessage);
        }
    
        const loansEnd = await returnDateResponse.json();
        const loans = [...loansStart.content, ...loansEnd.content];

        const newStart = new Date(loanDate);
        const newEnd = new Date(returnDate);

        const loanCount = loans.filter((loan: any) => {
          const loanStart = new Date(loan.loanDate);
          const loanEnd = new Date(loan.returnDate);

          const isOverlap =
            (newStart < loanEnd && newEnd > loanStart) ||
            (newStart >= loanStart && newStart <= loanEnd) ||
            (newEnd >= loanStart && newEnd <= loanEnd);
    
          return isOverlap;
        });

        if (loanCount.length >= 2) {
          throw new Error('El cliente ya tiene varios préstamos.');
        }
 
        return 'Préstamo válido';
    
      } catch (error: unknown) {
        if (error instanceof Error) {
          error: error.message;
        } else {
          error: 'Ha ocurrido error desconocido';
        }
        throw error;
      }
    };    

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {"Nuevo préstamo"}
        </DialogTitle>
        <DialogContent>
          {props.loan && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.loan.id}
              variant="standard"              
            />
          )}
          <TextField
            id="game"
            select
            label="Juego"
            defaultValue=""
            fullWidth
            variant="standard"
            name="game"
            value={form.game ? form.game.id : ""}
            onChange={handleChangeSelect}
          >
            {games &&
              games.map((option: Game) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            id="client"
            select
            label="Cliente"
            defaultValue=""
            fullWidth
            variant="standard"
            name="client"
            value={form.client ? form.client.id : ""}
            onChange={handleChangeSelect}
          >
            {clients &&
              clients.map((option: Client) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin="dense"
            id="loanDate"
            label="Fecha de inicio del préstamo"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.loanDate}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            id="returnDate"
            label="Fecha de fin del préstamo"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.returnDate}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          {dateError && <div style={{ color: 'red' }}>{dateError}</div>}
          {gameError && <div style={{ color: 'red' }}>{gameError}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button
            onClick={handleCreate}
            disabled={!form.client || !form.game || !form.loanDate || !form.returnDate}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}