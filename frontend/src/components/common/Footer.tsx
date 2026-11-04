const Footer = () => {
  return (
    <footer className="border-t bg-background px-4 py-4">
      <p className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ChatFlow. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
