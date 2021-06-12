const ListItem = ({ name, secondaryInfo, thumbnail, click }) => {
    let artists = secondaryInfo.map(secondaryInfo => secondaryInfo.name).join(', ');
    return(
        <div className='ListItem'>
            <span className='name'>{name}</span>
            <span className='secondaryInfo'>{artists}</span>
            <div className='add' onClick={click}><i className="fas fa-2x fa-plus"></i></div>
            <img src={thumbnail} alt={name}/>
        </div>
    );
}

export default ListItem;