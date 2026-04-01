import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center w-full h-screen">
            <Empty className="text-center">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Spinner />
                    </EmptyMedia>
                    <EmptyTitle>Cargando</EmptyTitle>
                    <EmptyDescription>
                        Por favor espere...
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    )
}