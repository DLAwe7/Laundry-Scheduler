import { NavLink, useMatch } from 'react-router-dom'

type SidebarNavItemProps = {
    to: string
    end?: boolean
    children: React.ReactNode
    onClick?: () => void
}

function SidebarNavItem({ to, end, children, onClick }: SidebarNavItemProps) {
    const match = useMatch({
        path: to,
        end: end ?? false,
    })

    if (match) return null

    return (
        <li className="sidebar-item">
            <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className="sidebar-link"
            >
                {children}
            </NavLink>
        </li>
    )
}

export default SidebarNavItem;