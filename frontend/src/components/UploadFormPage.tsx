import { useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { uploadSchema } from "@/schemas/uploadSchema"
import { useRef } from 'react';
import { uploadFile } from '../services/api';

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
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { DownloadCard } from './DownloadCard';

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
            toast.info('Analizando tu archivo... Esto puede tardar unos minutos')
            try {
                const formData = new FormData();
                formData.append('title', value.title);

                if (value.file && value.file.length > 0) {
                    formData.append('file', value.file[0]);
                }

                const response = await uploadFile(formData);

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                });

                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url);

                console.log('Formulario enviado correctamente');
                toast.success('Cuestionario generado correctamente');
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
        <div className="flex flex-col items-center p-4 gap-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Gestión de formularios</CardTitle>
                    <CardDescription>
                        Empieza subiendo un documento con la convocatoria
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
                                            <FieldLabel htmlFor={field.name}>Título de documento</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Título descriptivo del documento"
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
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    const selectedFile = field.state.value?.[0];

                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Archivo</FieldLabel>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="w-full"
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                                                    </Button>

                                                    <Input
                                                        ref={fileInputRef}
                                                        id={field.name}
                                                        name={field.name}
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="hidden"
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.files)}
                                                        aria-invalid={isInvalid}
                                                    />
                                                </div>

                                                {selectedFile && (
                                                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {selectedFile.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                field.handleChange(null);
                                                                if (fileInputRef.current) {
                                                                    fileInputRef.current.value = '';
                                                                }
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}

                                                <p className="text-xs text-muted-foreground">
                                                    Formatos permitidos: PDF, DOC, DOCX (máx. 5MB)
                                                </p>
                                            </div>

                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </FieldGroup>
                    </form>

                </CardContent>
                <CardFooter>
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
                                            Analizando...
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
            {downloadUrl && (
                <DownloadCard downloadUrl={downloadUrl} />
            )}
        </div>
    )
}