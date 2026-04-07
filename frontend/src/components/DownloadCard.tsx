import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FileDown } from "lucide-react"

type DownloadCardProps = {
    downloadUrl: string;
    fileName?: string;
}

export function DownloadCard({ downloadUrl, fileName = "resultado.docx" }: DownloadCardProps) {
    if (!downloadUrl) {
        return null;
    }

    return (
        <Card className="w-full max-w-md">
            <div className="text-center">
                <CardHeader>
                    <CardTitle>
                <p className="text-[#EC842B] text-sm font-semibold mb-2 p-2">
                    ¡Documento generado correctamente!
                </p>
                </CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-center items-center">
                <a
                    href={downloadUrl}
                    download={fileName}
                    className="inline-flex items-center gap-2 bg-[#094785] hover:bg-[#03294F] text-white px-4 py-2 font-medium rounded-md"
                >
                    <FileDown className="w-4 h-4" /> Descargar cuestionario
                </a>
                </CardFooter>
            </div>
        </Card>
    )
}

