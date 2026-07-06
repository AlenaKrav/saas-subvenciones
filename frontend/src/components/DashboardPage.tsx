import '../App.css';
import { DashboardCardLink } from '@/components/DashboardCardLink';

export default function DashboardPage() {
    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <DashboardCardLink
                        to="/formulario"
                        label="Ir a productos"
                    />

                    <DashboardCardLink
                        to="/formulario"
                        label="Ir a formulario"
                    />
                </div>
                <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
                </div>
            </div>
        </>
    )
}
