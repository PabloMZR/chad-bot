import { useState, useEffect } from 'react';
import api from '@/app/api/auth';

interface Document {
    id: number;
    filename: string;
    original_filename: string;
    file_type: string;
    file_size: number;
    upload_date: string;
    last_modified: string;
    is_public: boolean;
    description: string;
}

interface FileTypeInfo {
    icon: string;
    label: string;
    preview: boolean;
}

type FileType = 'pdf' | 'doc' | 'docx' | 'txt' | 'rtf' | 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 
                'mp3' | 'wav' | 'ogg' | 'mp4' | 'avi' | 'mov' | 'zip' | 'rar' | '7z';

const FILE_TYPES: Record<FileType, FileTypeInfo> = {
    // Documentos
    pdf: { icon: '📄', label: 'PDF', preview: false },
    doc: { icon: '📝', label: 'Word', preview: false },
    docx: { icon: '📝', label: 'Word', preview: false },
    txt: { icon: '📄', label: 'Texto', preview: true },
    rtf: { icon: '📄', label: 'RTF', preview: false },
    
    // Imágenes
    jpg: { icon: '🖼️', label: 'Imagen', preview: true },
    jpeg: { icon: '🖼️', label: 'Imagen', preview: true },
    png: { icon: '🖼️', label: 'Imagen', preview: true },
    gif: { icon: '🖼️', label: 'GIF', preview: true },
    webp: { icon: '🖼️', label: 'Imagen', preview: true },
    
    // Audio
    mp3: { icon: '🎵', label: 'Audio', preview: true },
    wav: { icon: '🎵', label: 'Audio', preview: true },
    ogg: { icon: '🎵', label: 'Audio', preview: true },
    
    // Video
    mp4: { icon: '🎥', label: 'Video', preview: true },
    avi: { icon: '🎥', label: 'Video', preview: true },
    mov: { icon: '🎥', label: 'Video', preview: true },
    
    // Otros
    zip: { icon: '📦', label: 'Comprimido', preview: false },
    rar: { icon: '📦', label: 'Comprimido', preview: false },
    '7z': { icon: '📦', label: 'Comprimido', preview: false },
};

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los documentos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            
            // Crear URL de vista previa para imágenes y videos
            const fileType = file.name.split('.').pop()?.toLowerCase() as FileType;
            if (fileType && FILE_TYPES[fileType]?.preview) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description);
        formData.append('is_public', isPublic.toString());

        try {
            await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSelectedFile(null);
            setDescription('');
            setIsPublic(false);
            setPreviewUrl(null);
            loadDocuments();
        } catch (err) {
            setError('Error al subir el documento');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;

        try {
            await api.delete(`/documents/${id}`);
            loadDocuments();
        } catch (err) {
            setError('Error al eliminar el documento');
            console.error(err);
        }
    };

    const handleDownload = async (id: number, filename: string) => {
        try {
            const response = await api.get(`/documents/${id}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Error al descargar el documento');
            console.error(err);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileTypeInfo = (fileType: string): FileTypeInfo => {
        const type = fileType.toLowerCase() as FileType;
        return FILE_TYPES[type] || { icon: '📄', label: 'Archivo', preview: false };
    };

    if (loading) return <div className="text-center">Cargando documentos...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mis Documentos</h1>

            {/* Formulario de subida */}
            <form onSubmit={handleUpload} className="mb-8 p-4 bg-white rounded-lg shadow">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Seleccionar Archivo
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {previewUrl && (
                        <div className="mt-4">
                            {selectedFile?.type.startsWith('image/') ? (
                                <img src={previewUrl} alt="Vista previa" className="max-h-48 rounded" />
                            ) : selectedFile?.type.startsWith('video/') ? (
                                <video src={previewUrl} controls className="max-h-48 rounded" />
                            ) : selectedFile?.type.startsWith('audio/') ? (
                                <audio src={previewUrl} controls className="w-full" />
                            ) : null}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Descripción
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="mr-2"
                        />
                        <span className="text-sm">Documento público</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!selectedFile || uploading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {uploading ? 'Subiendo...' : 'Subir Documento'}
                </button>
            </form>

            {/* Lista de documentos */}
            <div className="grid gap-4">
                {documents.map((doc) => {
                    const fileTypeInfo = getFileTypeInfo(doc.file_type);
                    return (
                        <div key={doc.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <div className="text-2xl">{fileTypeInfo.icon}</div>
                                    <div>
                                        <h3 className="font-semibold">{doc.original_filename}</h3>
                                        <p className="text-sm text-gray-600">{doc.description}</p>
                                        <p className="text-xs text-gray-500">
                                            {fileTypeInfo.label} • {formatFileSize(doc.file_size)} • 
                                            Subido: {new Date(doc.upload_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.original_filename)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Descargar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 