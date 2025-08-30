// /frontend/src/pages/ProgressPhotosPage.tsx

import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import { Camera, Plus, Trash2, X } from 'lucide-react';

interface Photo {
  id: string;
  imageUrl: string;
  createdAt: string;
}

// Interface para as fotos agrupadas
interface GroupedPhotos {
  [date: string]: Photo[];
}

export function ProgressPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  // MUDANÇA: Agora lidamos com múltiplos arquivos e prévias
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NOVO: Estado para o Lightbox (visualização ampliada)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/photos');
      setPhotos(response.data);
    } catch (err) {
      setError('Não foi possível carregar as fotos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);
  
  // NOVO: Agrupando fotos por data
  const groupedPhotos = useMemo(() => {
    return photos.reduce((acc, photo) => {
      const date = new Date(photo.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(photo);
      return acc;
    }, {} as GroupedPhotos);
  }, [photos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      const newPreviews: string[] = [];
      const fileReaders = selectedFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(fileReaders).then(results => {
        setPreviews(results);
      });
    }
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      // MUDANÇA: Enviando o array de prévias
      await api.post('/photos', { imageUrls: previews });
      setFiles([]);
      setPreviews([]);
      await fetchPhotos();
    } catch (err) {
      setError('Erro ao fazer upload das fotos.');
    } finally {
      setUploading(false);
    }
  };

  const openDeleteModal = (photoId: string) => {
    setPhotoToDelete(photoId);
    setDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!photoToDelete) return;
    try {
      await api.delete(`/photos/${photoToDelete}`);
      setPhotos(photos.filter(p => p.id !== photoToDelete));
      setDeleteModalOpen(false);
      setPhotoToDelete(null);
    } catch (err) {
      setError('Erro ao deletar foto.');
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-clickup-text-dark flex items-center justify-center gap-3">
            <Camera /> Sua Galeria de Progresso
          </h1>
          <p className="text-clickup-text-muted mt-2">Registre sua jornada visualmente e celebre cada mudança.</p>
        </div>

        {/* Seção de Upload */}
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border mb-12">
          <h2 className="font-semibold text-lg mb-4">Adicionar Novas Fotos</h2>
          <div className="flex flex-col gap-6">
            <label htmlFor="photo-upload" className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50/80 transition-colors">
              <div className="text-center text-clickup-text-muted">
                <Plus size={32} className="mx-auto" />
                <p>Clique para selecionar uma ou mais fotos</p>
              </div>
              <input id="photo-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} multiple />
            </label>
            
            {previews.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Pré-visualização ({previews.length} foto(s)):</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {previews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Prévia ${index + 1}`} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 w-full md:w-auto py-2 px-6 text-sm font-semibold rounded-md text-white bg-clickup-blue hover:bg-clickup-hover-blue transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Enviando...' : `Fazer Upload de ${previews.length} foto(s)`}
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
        
        {/* Galeria Agrupada por Data */}
        {loading ? (
          <p className="text-center">Carregando galeria...</p>
        ) : Object.keys(groupedPhotos).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedPhotos).map(([date, photosInDate]) => (
              <div key={date}>
                <h2 className="text-xl font-bold text-clickup-text-dark pb-2 mb-4 border-b">{date}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {photosInDate.map(photo => (
                    <div key={photo.id} onClick={() => setSelectedPhoto(photo.imageUrl)} className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
                      <img src={photo.imageUrl} alt="Progresso" className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <button onClick={(e) => { e.stopPropagation(); openDeleteModal(photo.id); }} className="absolute top-2 right-2 p-2 bg-red-600/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-clickup-text-muted">
            <Camera size={48} className="mx-auto mb-4" />
            <p>Sua galeria está vazia. Adicione sua primeira foto!</p>
          </div>
        )}
      </div>

      {/* NOVO: Lightbox para ver a foto ampliada */}
      {selectedPhoto && (
        <div onClick={() => setSelectedPhoto(null)} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in p-4">
          <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 text-white p-2">
            <X size={32} />
          </button>
          <img src={selectedPhoto} alt="Visualização ampliada" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}

      {/* Modal de Deleção */}
      {isDeleteModalOpen && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-clickup-text-dark">Confirmar Exclusão</h2>
            <p className="text-clickup-text-muted mt-2">Tem certeza que deseja deletar esta foto?</p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2 px-4 text-sm font-semibold rounded-md text-clickup-text-muted bg-gray-200 hover:bg-gray-300 transition-colors">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2 px-4 text-sm font-semibold rounded-md text-white bg-clickup-error hover:bg-red-600 transition-colors">Sim, deletar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}