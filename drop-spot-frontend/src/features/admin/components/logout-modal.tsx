import { LogoutOutlined, CloseOutlined } from '@ant-design/icons';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Çıkış Yap</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <CloseOutlined />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Çıkış yapmak istediğinizden emin misiniz?</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white rounded transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#4096FF' }}
          >
            <LogoutOutlined />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
