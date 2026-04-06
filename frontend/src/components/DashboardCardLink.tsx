import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

interface DashboardCardLinkProps {
  to: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export function DashboardCardLink({
  to,
  label,
  icon,
  disabled
}: DashboardCardLinkProps) {
  return (
    <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <Link to={to}>
                <Button
                  className="w-auto mt-2"
                  variant="primary"
                  size="xl"
                  disabled={disabled}>
                  {icon}
                  {label}
                  </Button>
                  </Link>
              </div>
  )
}