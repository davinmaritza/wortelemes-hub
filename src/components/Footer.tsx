const Footer = () => {
  return (
    <footer className="py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Wortelemes
        </p>
      </div>
    </footer>
  );
};

export default Footer;
