import { useState } from 'react'
import { savedSubtitlesStore } from '../../../../store/savedSubtitlesStore'

export const useSortAction = () => {
  const { handleSortFavorite } = savedSubtitlesStore
  const [showSortModal, setShowSortModal] = useState(false)
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(0)
  const [newPosition, setNewPosition] = useState('')

  const handleShowSortModal = (subtitleIndex: number) => {
    setSelectedSubtitleIndex(subtitleIndex)
    setNewPosition('')
    setShowSortModal(true)
  }

  const handleConfirmSort = () => {
    handleSortFavorite(selectedSubtitleIndex, Number(newPosition) - 1)
    // TODO: Implement sort functionality
    setShowSortModal(false)
  }

  return {
    showSortModal,
    setShowSortModal,
    selectedSubtitleIndex,
    newPosition,
    setNewPosition,
    handleShowSortModal,
    handleConfirmSort,
  }
}
