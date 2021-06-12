const Button = ({ text, click, classCSS }) => {
    return(
        <button className={classCSS} onClick={click}>{text}</button>
    );
}

export default Button;