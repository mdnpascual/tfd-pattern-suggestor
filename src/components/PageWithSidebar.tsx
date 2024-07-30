import React, { useState, ReactElement } from 'react';
import '../App.css'

interface SidebarItem {
	label: string;
	iconPath: string;
	Component: ReactElement;
}

interface PageWithSidebarProps {
	items: SidebarItem[];
}

const PageWithSidebarComponent: React.FC<PageWithSidebarProps> = ({ items }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
			<div className="page-container">
				<div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
					{sidebarOpen && (
					<ul>
						{items.map((item, index) => (
						<li key={index} onClick={() => setActiveIndex(index)}>
							<img src={item.iconPath} alt={item.label} style={{ width: 24, height: 24, marginRight: 10 }} />
							{item.label}
						</li>
						))}
					</ul>
					)}
				</div>

				<button
					className={`toggle-button ${sidebarOpen ? '' : 'collapsed'}`}
					onClick={toggleSidebar}
				>
					{sidebarOpen ? '<<' : '>>'}
				</button>

				<div className="content">
					{items[activeIndex].Component}
				</div>
			</div>
		);
	};

export default PageWithSidebarComponent;