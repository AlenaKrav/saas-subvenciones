import { Button } from '@/components/ui/button'
import { Link } from "@tanstack/react-router"

const ErrorPage = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center px-4 py-8 text-center text-(--brand-color)'>
                <h2 className='mb-6 text-5xl font-semibold'>
                    404
                </h2>
                <h3 className='mb-1.5 text-3xl font-semibold'>Algo ha salido mal</h3>
                <p className='text-muted-foreground mb-6 max-w-sm'>
                    No hemos podido encontrar la página que estás buscando
                </p>
                <Button asChild
                    className="w-auto mt-2"
                    type="button"
                    variant="outline"
                    size="lg">
                    <Link to='/dashboard' preload={false}>
                    Volver a dashboard</Link>
                </Button>
            </div>
        </div>
    )
}

export default ErrorPage