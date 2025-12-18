const Footer = () => {
  return (
    <footer className="py-10 bg-background">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Wortelemes
        </p>
      </div>
    </footer>
  );
};

export default Footer;
