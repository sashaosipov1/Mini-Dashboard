import { Flex, Link } from "@radix-ui/themes";
import React from "react";

const Header: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Flex>
      {children}
    </Flex>
  );
};

export default Header;