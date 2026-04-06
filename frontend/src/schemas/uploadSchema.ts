import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(3, {
    message: "El titulo debe tener al menos 3 caracteres.",
  }).max(30, {
    message: "El titulo no puede exceder 30 caracteres"
  }),
  file: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, {message: "Debes seleccionar un archivo"})
    .refine((files) => !files || files[0]?.size <= 5000000, {message: "El archivo no debe superar 5MB."})
    .refine((files) => !files || ['application/pdf', 
                        'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0]?.type), {message: "Formato de archivo no válido"})
});
