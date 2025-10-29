import { NavLink, Outlet } from 'react-router-dom';
import "./Layout.css"
function Layout() {
    return (
        <div className="layout">
            <header className="header">
                <h1>A la Carte</h1>
                <nav className="nav">
                    <NavLink to="/" className="nav_link">Card</NavLink>
                    <NavLink to="/cart" className="nav_link">Cart</NavLink>
                </nav>
            </header>

            <main className="main">
                <Outlet /> 
            </main>

            <footer className="footer">
                <p>© {new Date().getFullYear()} A la Carte. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;