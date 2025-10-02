import { X } from "lucide-react";

/**
 * Modal Component
 * 
 * A reusable modal component with:
 * - Backdrop blur effect
 * - Theme-consistent styling
 * - Close functionality
 * - Responsive design
 */
function Modal({ isOpen, onClose, title, children, type = "error" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-[#A17E3C]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-['IvyMode'] text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-6 pt-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#A17E3C] hover:bg-[#8B6B32] text-white rounded-full font-['Jost'] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;