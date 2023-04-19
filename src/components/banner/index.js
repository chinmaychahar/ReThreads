import './index.css';
import Banner from'../../assets/Banner.png'

const banner=()=>{
    return(
        <div className ='banner'>              {/*because className is nav-bar we can call nav-bar in index.scss and work on it's properties there || to='/' means it is our home page  */}
            <img src={Banner} alt="logo"/>
            </div>
    )
}

export default banner
