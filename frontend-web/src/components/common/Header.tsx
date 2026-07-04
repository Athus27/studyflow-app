import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoIcon from "../../assets/icons/logo.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import userIcon from "../../assets/icons/user-icon.png";

export const Header = () => {
	const navigate = useNavigate();
	const [showLinks, setShowLinks] = useState(false);
	const atual_url = window.location.href;
	const shouldShowUserButton = !atual_url.includes("/register") && !atual_url.includes("/login");

	const handleUserClick = () => {
		navigate("/user");
	};

	return (
		<div className="header">
			<nav className="nav-container">
				<div className="logo-container">
					<img src={logoIcon} className="logo" alt="StudyFlow" />
					<h1 className="img-link">StudyFlow</h1>
					<div className="nav-links">
						<button type="button" onClick={() => setShowLinks((current) => !current)}>
							<img src={menuIcon} alt="Menu" className="w-6 h-6" />
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
				</div>
				{shouldShowUserButton && (
					<button type="button" className="user-button" onClick={handleUserClick} aria-label="Abrir página do usuário">
						<img src={userIcon} alt="User" className="user-icon" />
					</button>
				)}
			</nav>
		</div>
	);
};
