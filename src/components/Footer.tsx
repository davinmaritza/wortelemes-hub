import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="py-10 bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-muted-foreground font-body text-xs">
            © {new Date().getFullYear()} Wortelemes
          </p>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Masuk Admin"
            title="Masuk Admin"
          >
            <Link to="/admin">
              <Shield className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
