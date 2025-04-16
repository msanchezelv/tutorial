import { useEffect, useState, useContext } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./Loan.module.css";
import CreateLoan from "./components/CreateLoan";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";
import { BackError } from "../../types/appTypes";
import { Loan as LoanModel } from "../../types/Loan";
import {
  useDeleteLoanMutation,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useGetLoansByPageQuery,
  useGetClientsQuery,
  useGetGamesQuery,
} from "../../redux/services/ludotecaApi";
import { LoaderContext } from "../../context/LoaderProvider";
import { FormControl, MenuItem, TextField, Select } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { Game } from "../../types/Game";
import { Client } from "../../types/Client";

export const Loan = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loans, setLoans] = useState<LoanModel[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>("");
  const [filterbyGame, setFilterByGame] = useState("");
  const [filterbyClient, setFilterByClient] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);

  const { data: clients } = useGetClientsQuery(null);
  const { data: games } = useGetGamesQuery({title: '', idCategory: ''});



  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  const { data: dataPage, error: errorPage, isLoading: isLoadingPage, isFetching: isFetchingPage } = useGetLoansByPageQuery({
    pageNumber,
    pageSize,
    idGame: filterbyGame,
    idClient: filterbyClient,
    date: filterDate ? dayjs(filterDate).startOf('day').format('YYYY-MM-DD'): '',
  });

  const [deleteLoanApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteLoanMutation();

  const [createLoanApi, { isLoading: isLoadingCreate, error: errorCreate }] =
    useCreateLoanMutation();

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoadingDelete || isFetchingPage
    );
  }, [isLoadingCreate, isLoadingDelete, isFetchingPage]);

  useEffect(() => {
    if (dataPage) {
      setLoans(dataPage.content);
      setTotal(dataPage.totalElements);
    }
  }, [dataPage, filterbyGame, filterbyClient, filterDate, pageNumber, pageSize]);

  useEffect(() => {
    if (errorCreate) {
      setMessage({
        text: "Se ha producido un error al crear el préstamo",
        type: "error",
      });
      
    }
  }, [errorCreate]);

  useEffect(() => {
    if (errorDelete) {
      if("status" in errorDelete) {
        dispatch(
          setMessage({
            text: "Se ha producido un error al eliminar el préstamo",
            type: "error",
          })
        );
      }
    }
  }, [errorDelete, dispatch]);

  useEffect(() => {}, [filterbyGame, filterbyClient, filterDate, pageNumber, pageSize]);

  const createLoan = (loan: LoanModel) => {
    setOpenCreate(false);
    createLoanApi(loan)
      .then(() => {
        setPageNumber(0);
        dispatch(
          setMessage({ text: "Préstamo creado correctamente", type: "ok" })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(setMessage({ text: "Se ha producido un error al crear el préstamo", type: "error" }));
      })
  };

  const handleDeleteLoan = () => {
    if (idToDelete){
      deleteLoanApi(idToDelete)
      .then(() => {
        setPageNumber(0);
        setIdToDelete("");
      })
      .catch((error) => {
        console.log("Error al eliminar el préstamo", error);
        dispatch(setMessage({text:"Error al eliminar el préstamo", type:"error"}));
      });
    }else{dispatch(setMessage({text:"No se ha seleccionado ningún préstamo", type:"error"}));}
  };

  return (
    <div className="container">
      <h1>Préstamos</h1>
      <div className='filters'>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <TextField
            id="game"
            select
            label="Juego"
            fullWidth
            variant="standard"
            name="game"
            value={filterbyGame}
            onChange={(e) => setFilterByGame(e.target.value)}
          >
            {
              games?.map((game: Game) => (
                <MenuItem key={game.id} value={game.id}>
                  {game.title}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <TextField
            id="client"
            select
            label="Cliente"
            fullWidth
            variant="standard"
            name="client"
            value={filterbyClient}
            onChange={(e) => setFilterByClient(e.target.value)}
          >
            {
              clients?.map((client: Client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DesktopDatePicker"]}>
            <DemoItem label="Fecha">
              <DesktopDatePicker
                value={filterDate ? dayjs(filterDate) : null}
                onChange={(newDate) => {
                  if(newDate && newDate.isValid()){
                  setFilterDate(newDate.startOf('day').toDate());
                }else{
                  setFilterDate(null);
                }
              }}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>

        <Button
        variant="outlined"
        onClick={() => {
          setFilterByGame("");
          setFilterByClient("");
          setFilterDate(null);
        }}
        >
          Limpiar
        </Button>
        </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Juego</TableCell>
              <TableCell>Fecha inicio préstamo</TableCell>
              <TableCell>Fecha fin préstamo</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan: LoanModel) => (
              <TableRow key={loan.id}>
                <TableCell component="th" scope="row">{loan.id}</TableCell>
                <TableCell style={{ width: 160 }}>{loan.client?.name}</TableCell>
                <TableCell style={{ width: 160 }}>{loan.game?.title}</TableCell>
                <TableCell style={{ width: 160 }}>{loan.loanDate}</TableCell>
                <TableCell  style={{ width: 160 }}>{loan.returnDate}</TableCell>
                <TableCell align="right">
                  <div className={styles.tableActions}>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => {
                        setIdToDelete(loan.id);;
                      }}
                    >
                      <ClearIcon />
                    </IconButton>                    
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={4}
                count={total}
                rowsPerPage={pageSize}
                page={pageNumber}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Préstamo nuevo
        </Button>
      </div>
      {openCreate && (
        <CreateLoan
          create={createLoan}
          loan={null}
          closeModal={() => {
            setOpenCreate(false);
          }}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar préstamo"
          text="Atención va a eliminar el préstamo, se perderán todos sus datos, ¿proceder?"
          confirm={handleDeleteLoan}
          closeModal={() => setIdToDelete("")}
        />
      )}
    </div>
  );
};