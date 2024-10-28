import React from "react";

export default function Layout({ children }){
    return(
        <div>
            <header>header</header>
            {children}
            <footer>footer</footer>
        </div>
    )
}