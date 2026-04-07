import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { isMatch, Link, useMatches } from '@tanstack/react-router';

export const BreadcrumbNav = () => {
//tanstack return all ofthe RouteMacth objects from the router that match actual route
const matches = useMatches();
//filter routes with "crumb" (loaderData.crumb that define o not it in every route we create)
const matchesWithCrumbs = matches.filter((match) =>
  isMatch(match, 'loaderData.crumb'),
);

// Convert route with crumbs matches into items
const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
  return {
    href: pathname,
    label: loaderData?.crumb,
  };
});

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <Link to={item.href} className="breadcrumb-link">
              {item.label}
            </Link>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};