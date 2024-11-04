import React, { ReactNode } from "react";
import Header from "./header";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <Header />
            {children}
            <footer>footer</footer>
        </div>
    );
}
