import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import './KeyboardShortcutsModal.css';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const shortcuts = [
        { key: 'D', description: 'Go to Dashboard' },
        { key: 'O', description: 'Go to Orders' },
        { key: 'M', description: 'Go to Media' },
        { key: 'C', description: 'Go to Content' },
        { key: 'P', description: 'Go to Products' },
        { key: 'I', description: 'Go to Inquiries' },
        { key: 'S', description: 'Go to Settings' },
        { key: '?', description: 'Toggle this modal' },
        { key: 'Esc', description: 'Close modal' },
    ];

    return (
        <div className="shortcuts-modal-overlay" onClick={onClose}>
            <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <Keyboard size={24} />
                        <h2>Keyboard Shortcuts</h2>
                    </div>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="shortcuts-grid">
                        {shortcuts.map((shortcut, index) => (
                            <div key={index} className="shortcut-item">
                                <span className="shortcut-description">{shortcut.description}</span>
                                <kbd className="shortcut-key">{shortcut.key}</kbd>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <p>Press <kbd>?</kbd> anywhere to view shortcuts</p>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
