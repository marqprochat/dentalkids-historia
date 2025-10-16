import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  linkTo?: string;
}

const Logo = ({ className, linkTo = "/" }: LogoProps) => {
  const logoElement = (
    <img 
      src="/dentalkids_logo.png" 
      alt="Dental Kids Logo" 
      className={cn("h-10 w-auto", className)} 
    />
  );

  if (linkTo) {
    return <Link to={linkTo}>{logoElement}</Link>;
  }
  
  return logoElement;
};

export default Logo;