import { createFileRoute } from '@tanstack/react-router'
import UploadFormPage from '@/components/UploadFormPage';


export const Route = createFileRoute('/_app/formulario')({
  component: UploadFormComponent,
      loader: () => {
        return {
            crumb: 'Formulario'
        }
    }
})

function UploadFormComponent() {
  return <UploadFormPage />
}
