import { useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { uploadSchema } from "@/schemas/uploadSchema"
import axios from 'axios';
import { useRef } from 'react';





import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// with .shape we access a particular key in our form validation schema
const titleSchema = uploadSchema.shape.title;
const fileSchema = uploadSchema.shape.file;


export default function UploadFormPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            title: '',
            file: null as FileList | null,
        },
        validators: {
            onSubmit: uploadSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const formData = new FormData();
                formData.append('title', value.title);

                if (value.file && value.file.length > 0) {
                    formData.append('file', value.file[0]);
                }

                const response = await axios.post('https://n8n.pixelinlove.net/webhook-test/57b34d34-ec07-4b97-824b-778ec755b35a',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        responseType: 'blob',
                    }
                );

                const url = URL.createObjectURL(response.data);
                setDownloadUrl(url);

                console.log('Fomrulario enviado correctamente');
                toast.success('Formulario enviado correctamente');
                form.reset();

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
            catch (error) {
                console.error('Error al enviar:', error);
                toast.error('No se pudo enviar el formulario. Intenta de nuevo.');
            }
        }
    })

    const handleReset = () => {
        form.reset();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-1 items-top justify-center p-4">
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle>Gestión de formularios</CardTitle>
                    <CardDescription>
                        Empieza subiendo un PDF con la convocatoria
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="formulario-subvenciones"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name="title"
                                validators={{ onChange: titleSchema }}
                            >
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Titulo de documento</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Titulo descriptivo del documento"
                                                autoComplete="off"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                            <form.Field
                                name="file"
                                validators={{ onChange: fileSchema }}
                            >
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Archivo</FieldLabel>
                                            <Input
                                                ref={fileInputRef}
                                                id={field.name}
                                                name={field.name}
                                                type="file"
                                                accept=".pdf, .doc, .docx"
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.files)}
                                                aria-invalid={isInvalid}
                                                placeholder="Sube el documento deseado"
                                                autoComplete="off"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </FieldGroup>
                    </form>
                              {downloadUrl && (
            <div className="mt-6 text-center">
              <p className="text-green-600 font-medium mb-2">
                ¡Documento generado correctamente!
              </p>
              <a
                href={downloadUrl}
                download="resultado.docx"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                <FileDown className="w-4 h-4" /> Descargar Word
              </a>
            </div>
          )}
                </CardContent>
                <CardFooter>
                    {/* form.Subscribe is special tanstack component, that listens to changes in form
                        selector es una function that only selects that parts of states of our interest
                        state.canSubmit = true all fields are valid, we can subit the form
                        state.isSubmitting=true, while onSumbit is executing
                    
                    */}
                    <form.Subscribe
                        selector={(state) => ({
                            canSubmit: state.canSubmit,
                            isSubmitting: state.isSubmitting,
                        })}
                    >
                        {(state) => (
                            <Field orientation="horizontal">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={state.isSubmitting}
                                >
                                    Resetear
                                </Button>
                                <Button
                                    type="submit"
                                    form="formulario-subvenciones"
                                    disabled={!state.canSubmit || state.isSubmitting}
                                >
                                    {state.isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analizando tu document...
                                        </>
                                    ) : (
                                        'Enviar'
                                    )}
                                </Button>
                            </Field>
                        )}
                    </form.Subscribe>
                </CardFooter>
            </Card>
        </div>
    )
}
