import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
}

export const PDFUploader = ({ onFileSelect }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const pdfFile = files.find((file) => file.type === "application/pdf");

      if (pdfFile) {
        onFileSelect(pdfFile);
        toast.success("PDF carregado com sucesso!");
      } else {
        toast.error("Por favor, faça upload de um arquivo PDF");
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
      toast.success("PDF carregado com sucesso!");
    } else {
      toast.error("Por favor, selecione um arquivo PDF");
    }
  };

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        min-h-[400px] border-2 border-dashed rounded-lg
        transition-all duration-300
        ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
        }
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-2xl shadow-lg">
            {isDragging ? (
              <FileText className="w-12 h-12 text-primary-foreground animate-bounce" />
            ) : (
              <Upload className="w-12 h-12 text-primary-foreground" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            {isDragging ? "Solte o arquivo aqui" : "Carregue seu PDF"}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Arraste e solte um arquivo PDF de livro horizontal ou clique para selecionar
          </p>
        </div>

        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-105">
            <Upload className="w-4 h-4" />
            Selecionar Arquivo
          </span>
        </label>

        <p className="text-xs text-muted-foreground">
          Suporta arquivos PDF com páginas duplas horizontais
        </p>
      </div>
    </div>
  );
};
