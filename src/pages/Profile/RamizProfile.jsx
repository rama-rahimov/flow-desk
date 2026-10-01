import lion from '../../images/justlion.jpg'
export default function ProfileRamiz(){
    return(<div className="header_ramiz">
    <header>
        <div className="logo">
            <h3>Flow Desk</h3>
        </div>
        <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </nav>
    </header>
    <main>
        <h2>Home</h2>
        <div>
            <div className="left_side">
                <img alt='lion' src={lion}/>
            </div>
            <div className="right_side">
               <div><label>Name:</label><input disabled={true} defaultValue="Ramiz" /></div>
                <div><label>Last name:</label><input disabled={true} defaultValue="Ragimov"/></div>
                <div><label>Age:</label><input disabled={true} defaultValue="27"/></div>
                <div><label>Profession:</label><input disabled={true} defaultValue='Node.js developer'/></div>
            </div>
        </div>
        <button onClick={() => console.log('Urraaa')}>Apply to Flow desk</button>
    </main>
    <footer>

    </footer>
    </div>)
}