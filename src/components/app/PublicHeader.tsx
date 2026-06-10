import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LogoInline } from "@/components/app/Logo";
import { useApp } from "@/store/app-store";

export default function PublicHeader() {
  const { user } = useApp();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("affiliate_code", ref);
    }
  }, [searchParams]);

  const affiliateCode = localStorage.getItem("affiliate_code");
  const authLink = affiliateCode ? `/auth?ref=${affiliateCode}` : "/auth";
  const signupLink = affiliateCode
    ? `/auth?mode=signup&ref=${affiliateCode}`
    : "/auth?mode=signup";

  return (
    <header className="container flex items-center justify-between py-6">
      <Link to="/" aria-label="JusMulher">
        <LogoInline />
      </Link>
      <div className="hidden items-center gap-2 md:flex">
        <Button asChild variant="ghost">
          <Link to="/precos">Preços</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/faq">FAQ</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/quem-somos">Quem Somos</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/blog">Blog</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to={authLink}>Entrar</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link to={user ? "/app" : signupLink}>Começar agora</Link>
        </Button>
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4">
              <Link to="/precos" className="text-lg font-medium">
                Preços
              </Link>
              <Link to="/faq" className="text-lg font-medium">
                FAQ
              </Link>
              <Link to="/quem-somos" className="text-lg font-medium">
                Quem Somos
              </Link>
              <Link to="/blog" className="text-lg font-medium">
                Blog
              </Link>
              <hr />
              <Button asChild variant="ghost">
                <Link to={authLink}>Entrar</Link>
              </Button>
              <Button asChild>
                <Link to={user ? "/app" : signupLink}>
                  Começar agora
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
