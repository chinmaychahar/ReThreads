import React, { useState, useEffect ,useRef} from "react"; 
import { makeStyles} from "@material-ui/core/styles";
import { IconButton } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';


import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  // Define the root styles for the carousel container
  root: {
    maxWidth: "1400px",
    marginTop: "auto",
  },
  
  // Define the styles for the carousel container
  carouselContainer: {
    // Display the flex container and center its contents vertically
    display: "flex",
    alignItems: "center",
    
    // Position the container relative to its parent and set the bottom margin
    position: "relative",
    marginBottom: theme.spacing(2),
    
    // Hide horizontal overflow and set the flex direction to column on small screens
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  
  // Define the styles for the left and right arrow buttons
  arrowButton: {
    // Position the button in the center of the carousel container and set its size
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
    transition: "all 0.01s ease",
    
    // Change the background color on hover
    "&:hover": {
      backgroundColor: "#D3D3D3",
    },
  },
  // Define the styles for the left arrow button
  leftArrow: {
    left: "0",
  },
  // Define the styles for the right arrow button
  rightArrow: {
    right: "0",
  },
  
  // Define the styles for the carousel items
  carouselContent: {
    // Display the flex container and hide horizontal overflow
    display: "flex",
    overflowX: "hidden",
    
    // Align the items to the left, position the container relative to its parent, and add transitions
    alignItems: "left",
    position: "relative",
    transition: "all 1000000s ease",
    
   // Add gradients on both sides of the container to create a fade effect
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
  
  // Define the styles for the individual carousel items
  carouselItem: {
    // Display the item as a flex container and center its contents
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transform: 'translateY(-5px)', 
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' ,
    
    // Set padding and margins for the item, as well as its background and border styles
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
  itemPrice: {
    color: theme.palette.secondary.main,
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  addToCartButton: {
    borderRadius: "10px",
    padding: "5px 10px",
    backgroundColor: "#D9A900",
    color: "#fff",
    transition: "all 1000000s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const items = [
  {
    name: "Product 1",
    price: "Rs.499",
    image: "./images/Product1.png",
  },
  {
    name: "Product 2",
    price: "Rs 599",
    image: "./images/Product2.png",
    
  },
  {
    name: "Product 3",
    price: "Rs 599",
    image: "./images/Product3.png",
  },
  {
    name: "Product 4",
    price: "Rs 499",
    image: "./images/Product4.png",
  },
  {
    name: "Product 5",
    price: "Rs 699",
    image: "./images/Product5.png",
  },
  {
    name: "Product 6",
    price: "Rs 400",
    image: "./images/Product6.png",
  },
  {
    name: "Product 7",
    price: "Rs 460",
    image: "./images/Product7.png",
  },
  {
    name: "Product 8",
    price: "$Rs 599",
    image: "./images/Product8.png",
  },
  {
    name: "Product 9",
    price: "Rs 699",
    image: "./images/Product3.png",
  },
  {
    name: "Product 10",
    price: "Rs 499",
    image: "./images/Product4.png",
  },
  {
    name: "Product 11",
    price: "Rs 699",
    image: "./images/Product5.png",
  },

];


const itemStyle = {
  width: "200px",
  height: "250px",
  background: "#D3D3D3",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
  borderRadius: "10px",


};
const TopFeatured = () => {
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
    const interval = setInterval(goToNextSlide, 10);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const [translateX, setTranslateX] = useState(0);

const handleLeftArrowClick = () => {
  setTranslateX(translateX + 100);
};

const handleRightArrowClick = () => {
  setTranslateX(translateX - 100);
};

  return (

    <div className={classes.root}>
      <Typography variant="h4" className={classes.sectionHeading} style={{textAlign: "center", color: "#D9A900"}}>
  TOP FEATURED
</Typography>

      <div className={classes.carouselContainer}>
        <IconButton className={`${classes.arrowButton} ${classes.leftArrow}`} onClick={goToPreviousSlide}>
          <ChevronLeftIcon />
        </IconButton>
        <div className={classes.carouselContent} style={{ transform: `translateX(${translateValue}px)` }} ref={carouselRef}>
          {items.map((item, index) => (
            <Paper className={classes.carouselItem} key={index}>
              <img src={item.image} alt={item.name} style={itemStyle} />
              <Typography variant="body1" className={classes.itemPrice}>
                {item.price}
              </Typography>
              <Button variant="contained" className={classes.addToCartButton}>
                Add to Cart
              </Button>
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

export default TopFeatured;
