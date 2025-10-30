"use client";

import React from "react";
import { Box, Heading, Theme } from "@radix-ui/themes";
import Header from "./Header";
import Footer from "./Footer";
import classNames from "classnames";

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isSidebarExpand, setIsSidebarExpand] = React.useState<boolean>(true);

    return (
        <>
            <Theme appearance="inherit">
                <Box
                    className={classNames(
                        'bg-white z-50',
                        isSidebarExpand ? "ml-72" : "ml-20"
                    )}
                    position="fixed"
                    width="100%"
                    height={"var(--header-height)"}
                >
                    <Header>
                        <Heading>Header</Heading>
                    </Header>
                </Box>

                <Box
                    pt={"var(--header-height)"}
                    minHeight={"calc(100vh - var(--footer-height))"}
                    className={classNames(
                        "bg-gray-50",
                        "transition-all duration-300 ease-in-out mx-0",
                        isSidebarExpand ? "ml-72" : "ml-20"
                    )}
                >
                    <main className="transition-none p-6">{children}</main>
                </Box>

                <Box
                    height={"var(--footer-height)"}
                    className={classNames(
                        "flex align-bottom",
                        "transition-all duration-300 ease-in-out mx-0",
                        isSidebarExpand ? "ml-72" : "ml-20"
                    )}
                >
                    <Footer />
                </Box>
            </Theme>
        </>
    );
};

export default MainLayout;