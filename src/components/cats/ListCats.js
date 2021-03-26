import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  getCats,
  getVotes,
  vote,
  favourite,
  unfavourite,
} from "../../store/catsSlice";
import {
  Container,
  Grid,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    overflow: "hidden",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  img: {
    height: theme.breakpoints.width > 340 ? "auto" : 240,
    width: theme.breakpoints.width > 340 ? 340 : "auto",
  },
  votes: {
    width: 220,
    display: "inline-flex",
    marginLeft: 14,
  },
}));

export default function ListCats(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { cats, loadedCats, loadedVotes } = useSelector(({ cats }) => cats);

  useEffect(() => {
    if (!loadedCats) dispatch(getCats());
  }, [dispatch]);

  useEffect(() => {
    if (loadedCats && !loadedVotes) dispatch(getVotes());
  }, [loadedCats]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} className={classes.root}>
        {cats.map(({ id, url, favouriteId, votes }) => {
          return (
            <Grid item xl={3} lg={4} md={6} xs={12} key={id}>
              <Paper elevation={2} className={classes.paper}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <img src={url} alt={id} className={classes.img} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="button" className={classes.votes}>
                      Votes: {votes}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        if (favouriteId) {
                          dispatch(unfavourite({ favouriteId }));
                        } else {
                          dispatch(favourite({ imageId: id }));
                        }
                      }}
                    >
                      {favouriteId !== undefined ? (
                        <FavoriteOutlined />
                      ) : (
                        <FavoriteBorderOutlined />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        dispatch(vote({ imageId: id, value: 1 }));
                      }}
                    >
                      <ArrowUpwardOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        dispatch(vote({ imageId: id, value: 0 }));
                      }}
                    >
                      <ArrowDownwardOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
