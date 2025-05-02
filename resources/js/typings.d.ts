export {};

declare module "Components/NavBar" {
    import React from "react";

    const NavBar: React.FC<{ auth?: any }>;
    export default NavBar;
}
