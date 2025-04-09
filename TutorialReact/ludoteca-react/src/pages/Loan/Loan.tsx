import { useEffect, useState, useContext } from "react";
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
} from "../../redux/services/ludotecaApi";
import { LoaderContext } from "../../context/LoaderProvider";

export const Loan = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loans, setLoans] = useState<LoanModel[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [loanToUpdate, setLoanToUpdate] = useState<LoanModel | null>(
    null
  );

  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);

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

  const { data, error, isLoading } = useGetLoansByPageQuery({
    pageNumber,
    pageSize,
  });

  const [deleteLoanApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteLoanMutation();

  const [createLoanApi, { isLoading: isLoadingCreate }] =
    useCreateLoanMutation();

  const [updateLoanApi, { isLoading: isLoadingUpdate }] =
    useUpdateLoanMutation();

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    );
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate]);

  useEffect(() => {
    if (data) {
      setLoans(data.content);
      setTotal(data.totalElements);
    }
  }, [data]);

  useEffect(() => {
    if (errorDelete) {
      if ("status" in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: "error",
          })
        );
      }
    }
  }, [errorDelete, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
    }
  }, [error]);

  const createLoan = (loan: LoanModel) => {
    setOpenCreate(false);
    if (loan.id) {
      updateLoanApi(loan)
        .then(() => {
          dispatch(
            setMessage({
              text: "Préstamo actualizado correctamente",
              type: "ok",
            })
          );
          setLoanToUpdate(null);
        })
        .catch((err) => console.log(err));
    } else {
      createLoanApi(loan)
        .then(() => {
          dispatch(
            setMessage({ text: "Préstamo creado correctamente", type: "ok" })
          );
          setLoanToUpdate(null);
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteLoan = () => {
    deleteLoanApi(idToDelete)
      .then(() => {
        setIdToDelete("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1>Préstamos</h1>
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
                      aria-label="update"
                      color="primary"
                      onClick={() => {
                        setLoanToUpdate(loan);
                        setOpenCreate(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        setIdToDelete(loan.id);
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
          loan={loanToUpdate}
          closeModal={() => {
            setLoanToUpdate(null);
            setOpenCreate(false);
          }}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar préstamo"
          text="Atención va a eliminar el préstamo, se perderán todos sus datos, ¿proceder?"
          confirm={deleteLoan}
          closeModal={() => setIdToDelete("")}
        />
      )}
    </div>
  );
};