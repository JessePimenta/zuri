import Link from "next/link";

export const Nav = () => (
  <nav className="ui-chrome font-ui">
    <Link href="#" className="nav-link">
      Listen
    </Link>
    <Link href="#" className="nav-link">
      Store
    </Link>
    <Link href="#" className="nav-link">
      Contact
    </Link>
  </nav>
);
