import React from "react";
import Link from "next/link";

const ClickToCall = ({ email, children }) => {
  return <Link href={`mailto:${email}`}>{children}</Link>;
};
export default ClickToCall;
