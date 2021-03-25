import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCats } from "../../store/catsSlice";
import { Paper, Grid } from "@material-ui/core";

export default function ListCats(props) {
  const dispatch = useDispatch();
  const cats = useSelector((state) => state.cats);

  useEffect(() => {
    if (!cats.length) dispatch(getCats());
  }, [dispatch]);
  return (
    <Grid container spacing={3}>
      {cats?.map((cat) => {
        return (
          <Grid item xs={3} key={cat.id}>
            <Paper elevation={3}>
              <img src={cat.url} />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
