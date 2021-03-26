import { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  MenuOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  PetsOutlined,
  AddCircleOutlineOutlined,
} from "@material-ui/icons";
import { Router, Link, navigate } from "@reach/router";
import { ListCats, NewCat } from "../cats/";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer, closeDrawer } from "../../store/appSlice";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function App() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const { drawerState } = useSelector(({ app }) => app);

  const handleDrawerOpen = () => {
    dispatch(openDrawer());
  };

  const handleDrawerClose = () => {
    dispatch(closeDrawer());
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerState,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerState && classes.hide)}
          >
            <MenuOutlined />
          </IconButton>
          <Typography variant="h6" noWrap>
            Cats for Waracle
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerState}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftOutlined />
            ) : (
              <ChevronRightOutlined />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/")}>
            <ListItemIcon>
              <PetsOutlined />
            </ListItemIcon>
            <ListItemText primary={<Link to="/">My cats</Link>} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/upload")}>
            <ListItemIcon>
              <AddCircleOutlineOutlined />
            </ListItemIcon>
            <ListItemText primary={<Link to="/upload">New Cat?!</Link>} />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerState,
        })}
      >
        <div className={classes.drawerHeader} />
        <Router>
          <ListCats path="/" />
          <NewCat path="/upload" />
        </Router>
      </main>
    </div>
  );
}
