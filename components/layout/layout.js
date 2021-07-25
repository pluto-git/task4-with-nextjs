import MainNavigation from "./navigation";

export default function Layout(props) {
  return (
    <>
      <MainNavigation />
      <main className="container-fluid py-3 flex-fill">{props.children}</main>
      <footer className="footer"> @BE PART OF OUR CLUB</footer>
    </>
  );
}
