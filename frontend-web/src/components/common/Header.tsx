import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logoIcon from "../../assets/icons/logo.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import userIcon from "../../assets/icons/user-icon.png";

export const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [showLinks, setShowLinks] = useState(false);
	const shouldShowUserButton = !["/register", "/login"].includes(location.pathname);
	const navClassName = shouldShowUserButton ? "nav-container" : "nav-container nav-container-public";

	const handleUserClick = () => {
		navigate("/user");
	};

	return (
		<div className="header">
			<nav className={navClassName}>
				<div className="logo-container">
					<img src={logoIcon} className="logo" alt="StudyFlow" />
					<h1 className="logo-text">StudyFlow</h1>
					<div className="nav-links">
						<button type="button" onClick={() => setShowLinks((current) => !current)}>
							<img src={menuIcon} alt="Menu" className="w-auto h-6" />
						</button>
						{showLinks && (
							<div className="top-menu">
								<a href="/" className="nav-link">
									Home
								</a>
								<a href="/about" className="nav-link">
									About
								</a>
								<a href="/contact" className="nav-link">
									Contact
								</a>
							</div>
						)}
					</div>
				{shouldShowUserButton && (
					<button type="button" className="user-button" onClick={handleUserClick} aria-label="Abrir página do usuário">
						<img src={userIcon} alt="User" className="user-icon" />
					</button>
				)}
				</div>
			</nav>
		</div>
	);
};
