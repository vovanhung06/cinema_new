import { useState, useMemo } from 'react';
import { initialComments } from '../lib/mockData';

export function useComments() {
  const [comments, setComments] = useState(initialComments);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComments = useMemo(() => {
    if (!searchTerm) return comments;
    const term = searchTerm.toLowerCase();
    return comments.filter(c => 
      c.user.toLowerCase().includes(term) || 
      c.movie.toLowerCase().includes(term) ||
      c.content.toLowerCase().includes(term)
    );
  }, [comments, searchTerm]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const handleDeleteClick = (comment) => {
    setSelectedComment(comment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setComments(prev => prev.filter(c => c.id !== selectedComment.id));
    setIsDeleteModalOpen(false);
    setIsDeleteSuccessModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const closeDeleteSuccessModal = () => setIsDeleteSuccessModalOpen(false);

  return {
    comments: filteredComments,
    searchTerm,
    setSearchTerm,
    isDeleteModalOpen,
    isDeleteSuccessModalOpen,
    selectedComment,
    handleDeleteClick,
    handleConfirmDelete,
    closeDeleteModal,
    closeDeleteSuccessModal,
  };
}
