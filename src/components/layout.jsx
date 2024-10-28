import React from "react";
import { Children } from "react";

export default function Layout(){
    return(
        <div>
            <header>header</header>
            {Children}
            <footer>footer</footer>
        </div>
    )
}