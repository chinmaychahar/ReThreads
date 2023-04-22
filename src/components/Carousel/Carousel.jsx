import React, { useState, useEffect ,useRef} from "react"; 
import { makeStyles} from "@material-ui/core/styles";
import { IconButton } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';


import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({

  root: {
    maxWidth: "1400px",
    marginTop: "720px",
  },
 
  carouselContainer: {
    display: "flex",
    alignItems: "center",
    
    position: "relative",
    marginBottom: theme.spacing(2),
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
    zIndex: "1",
    transition: "all 1000000s ease",
    "&:hover": {
       backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
  },
  leftArrow: {
    left: "0",
  },
  rightArrow: {
    right: "0",
  },
  carouselContent: {
    display: "flex",
    overflowX: "hidden",
    alignItems: "left",
    position: "relative",
   transition: "all 100000s ease",
    "&:after, &:before": {
      content: '""',
      position: "absolute",
      top: "0",
      bottom: "0",
      zIndex: "2",
      width: "50px",
      background: "linear-gradient(to left, rgba(255, 255, 255, 0), #fff)",
    },
    "&:before": {
      left: "0",
    },
    "&:after": {
      right: "0",
      transform: "rotate(360deg)",
    },
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
    borderRadius: "10px",
    minWidth: "250px",
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  itemName: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    color: "black", // change text color to mustard yellow
  },
  itemPrice: {
    color:"black",
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
}));



const items = [
  {
    image: "./images/Elderly.png",
    title: "ELDERLY",
  },
  {
    image: "./images/Crebreal palsy.png",
    title: "CEREBRAL PALSY",
  },
  {
    image: "./images/Alz.png",
    title: "ALZHEIMER'S",
  },
  {
    image: "./images/Parkinsons.png",
    title: "PARKINSON'S",
  },
  {
    image: "./images/Elderly.png",
    title: "ELDERLY",
  },
  {
    image: "./images/Parkinsons.png",
    title: "PARKINSON'S",
  },
  {
    image: "./images/Crebreal palsy.png",
    title: "CEREBREL PALSY",
  },
  {
    image: "./images/Elderly.png",
    title: "ELDERLY",
  },
  {
    image: "./images/Crebreal palsy.png",
    title: "CEREBRAL PALSY",
  },
  {
    image: "./images/Alz.png",
    title: "ALZHEIMER'S",
  },
  {
    imageSrc: "./images/Parkinsons.png",
    title: "PARKINSON'S",
  },
  
];
const itemStyle = {
  width: "200px",
  height: "230px",
  background: "#D3D3D3",
  orderRadius: "10px",
  transform: 'translateY(-5px)', 
 
};

const ShopByDisabilityCarousel = () => {
  const classes = useStyles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateValue, setTranslateValue] = useState(0);
  const carouselRef = useRef();

  const goToNextSlide = () => {
    if (currentIndex === items.length - 1) {
      setCurrentIndex(0);
      setTranslateValue(0);
    } else {
      setCurrentIndex(currentIndex + 1);
      setTranslateValue(translateValue - carouselRef.current.offsetWidth);
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex === 0) {
      setCurrentIndex(items.length - 1);
      setTranslateValue(-(carouselRef.current.offsetWidth * (items.length - 1)));
    } else {
      setCurrentIndex(currentIndex - 1);
      setTranslateValue(translateValue + carouselRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 6);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className={classes.root}>
    <Typography variant="h4" className={classes.sectionHeading} style={{textAlign: "center", color: "#D9A900"}}>
    SHOP BY CATEGORY
  </Typography>
  
      <div className={classes.carouselContainer}>
        <IconButton className={`${classes.arrowButton} ${classes.leftArrow}`} onClick={goToPreviousSlide}>
          <ChevronLeftIcon />
        </IconButton>
        <div className={classes.carouselContent} style={{ transform: `translateX(${translateValue}px)` }} ref={carouselRef}>
          {items.map((item, index) => (
            <Paper className={classes.carouselItem} key={index}>
              <img src={item.image} alt={item.title} style={itemStyle} />
              <Typography variant="h6" className={classes.itemName}>
                {item.title}
              </Typography>
            </Paper>
          ))}
        </div>
        <IconButton className={`${classes.arrowButton} ${classes.rightArrow}`} onClick={goToNextSlide}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ShopByDisabilityCarousel;
