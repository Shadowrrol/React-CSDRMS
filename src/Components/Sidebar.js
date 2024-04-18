import React from 'react';
import {Link} from 'react-router-dom';
import SidebarData from './SidebarData';


function Sidebar(){
    return (
        <div className="Sidebar">
            <img className="Logo" alt="" src="/image-removebg-preview (1).png"/>
            <ul className="SidebarList">
            {SidebarData.map((val, key)=> {
            return (
                <li key={key} className="Row" id={window.location.pathname == val.link ? "active" : ""}
                onClick={() => {window.location.pathname = val.link;}}>
                    <div id="icon">{val.icon}</div>
                    <div id="title">{val.title}</div>
                </li>
            )
        })}</ul>
        </div>
    );
}
export default Sidebar;