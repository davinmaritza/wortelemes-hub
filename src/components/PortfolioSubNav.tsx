import { Link, useLocation } from 'react-router-dom';

interface SubNavItem {
  label: string;
  path: string;
  children?: SubNavItem[];
}

const portfolioCategories: SubNavItem[] = [
  { label: 'All', path: '/portfolio' },
  { label: 'Video Commish', path: '/portfolio/VideoCommish' },
  { 
    label: 'GTA Commish', 
    path: '/portfolio/GTACommish',
    children: [
      { label: 'Vehicle', path: '/portfolio/GTACommish/Vehicle' },
      { label: 'Outfits', path: '/portfolio/GTACommish/Outfits' },
    ]
  },
];

const PortfolioSubNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/portfolio') {
      return location.pathname === '/portfolio';
    }
    return location.pathname.startsWith(path);
  };

  const isExactActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4 border-b border-border">
      {portfolioCategories.map((category) => (
        <div key={category.path} className="relative group">
          <Link
            to={category.path}
            className={`px-3 py-1.5 text-sm font-body rounded-md transition-colors ${
              isExactActive(category.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {category.label}
          </Link>
          
          {category.children && (
            <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col bg-popover border border-border rounded-md shadow-lg z-20 min-w-[120px]">
              {category.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`px-3 py-2 text-sm font-body transition-colors whitespace-nowrap ${
                    isExactActive(child.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default PortfolioSubNav;
