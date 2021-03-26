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
  imgGrid: {
    backdropFilter: "sepia(0.5)",
    paddingBottom: "0px !important",
  },
  img: {
    height: theme.breakpoints.width > 340 ? "auto" : 240,
    width: theme.breakpoints.width > 340 ? 340 : "auto",
  },
  actionGrid: {
    backgroundColor: theme.palette.secondary.light,
  },
  votes: {
    display: "inline-flex",
    marginTop: 14,
    marginLeft: 20,
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
    <Grid container spacing={3} className={classes.root}>
      {cats.map(({ id, url, favouriteId, votes }) => {
        return (
          <Grid item xl={3} lg={4} md={6} xs={12} key={id}>
            <Paper elevation={2} className={classes.paper}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12} className={classes.imgGrid}>
                  <img src={url} alt={id} className={classes.img} />
                </Grid>
                <Grid item xs={12} className={classes.actionGrid}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="button" className={classes.votes}>
                        Votes: {votes}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
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
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() => {
                          dispatch(vote({ imageId: id, value: 1 }));
                        }}
                      >
                        <ArrowUpwardOutlined />
                      </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() => {
                          dispatch(vote({ imageId: id, value: 0 }));
                        }}
                      >
                        <ArrowDownwardOutlined />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
