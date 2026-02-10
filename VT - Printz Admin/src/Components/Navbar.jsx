import React, { useState } from 'react'
import { Link } from "react-router-dom";

function Navbar({ onNavigate, activeTab }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const handleNav = (tab) => {
        if (onNavigate) onNavigate(tab);
        closeMenu();
    }

    const NavLink = ({ label, tab }) => (
        <button
            onClick={() => handleNav(tab)}
            className={`relative py-2 text-lg transition font-medium
        after:absolute after:left-0 after:bottom-1 after:h-[2px]
        after:bg-[#DB2A7B] after:w-0 hover:after:w-full
        ${activeTab === tab ? "after:w-full text-[#DB2A7B]" : "text-[#02192F]"}
      `}
        >
            {label}
        </button>
    );

    return (
        <nav className="fixed top-0 z-[100] w-full">
            <div className="w-full bg-[#fff] h-[84px] flex items-center pl-4 pr-10 text-white relative shadow-sm border-b border-gray-100">

                {/* LOGO */}
                <div onClick={() => handleNav('orders')} className="flex-shrink-0 cursor-pointer pb-2">
                    <img src="/VT_LogoTS.png" className="h-16 md:h-20" alt="VT Printz Logo" />
                </div>

                {/* DESKTOP MENU */}
                <div className="ml-auto hidden mmmd:flex items-center gap-8">
                    <NavLink label="Orders" tab="orders" />
                    <NavLink label="Manage Products" tab="productmanager" />
                    <NavLink label="Feedback" tab="feedback" />
                </div>

                {/* HAMBURGER */}
                <button className="ml-auto mmmd:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    <Hamburger open={menuOpen} />
                </button>
            </div>


            {/* MOBILE MENU */}
            <div
                className={`mmmd:hidden fixed top-[84px] left-0 w-full h-[calc(100vh-84px)]
        bg-[#02192F] text-white p-6 transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col gap-6 text-xl font-semibold">
                    <button onClick={() => handleNav('orders')} className="text-left hover:text-[#DB2A7B]">Orders</button>
                    <button onClick={() => handleNav('productmanager')} className="text-left hover:text-[#DB2A7B]">Manage Products</button>
                    <button onClick={() => handleNav('feedback')} className="text-left hover:text-[#DB2A7B]">Feedback</button>
                </div>
            </div>

        </nav>
    )
}

export default Navbar


function Hamburger({ open }) {
    return (
        <button
            className={`hamburger ${open ? "open" : ""}`}
            aria-label="Menu"
        >
            <span />
            <span />
            <span />
        </button>
    );
}