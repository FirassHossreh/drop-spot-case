import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import CardModal from '../features/admin/components/card-modal';
import CardBox from '../features/admin/components/card-box';
import { getAllDrops } from '../features/admin/services/get-all-drops';
import { deleteDrop } from '../features/admin/services/delete-drop';
import { updateDrop } from '../features/admin/services/update-drop';
import { createDrop } from '../features/admin/services/create-drop';

export interface CardType {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
}

interface FormDataType {
  title: string;
  description: string;
  startAt: Dayjs | null;
  endAt: Dayjs | null;
}

export default function AdminDrops() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    description: '',
    startAt: null,
    endAt: null,
  });

  useEffect(() => {
    async function fetchDrops() {
      const drops: CardType[] = await getAllDrops();
      setCards(drops);
    }
    fetchDrops();
  }, []);

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({ title: '', description: '', startAt: null, endAt: null });
    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    const card = cards[index];
    setFormData({
      title: card.title,
      description: card.description,
      startAt: dayjs(card.startAt),
      endAt: dayjs(card.endAt),
    });
    setModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    const drop = cards[index];

    await deleteDrop(drop.id);

    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const handleSubmit = async () => {
    if (!formData.startAt || !formData.endAt) return;

    const dropData = {
      title: formData.title,
      description: formData.description,
      startAt: formData.startAt.toISOString(),
      endAt: formData.endAt.toISOString(),
    };

    if (editingIndex !== null) {
      const drop = cards[editingIndex];
      const updated = await updateDrop(drop.id, dropData);
      if (updated) {
        const newCards = [...cards];
        newCards[editingIndex] = updated.data;
        setCards(newCards);
        setModalOpen(false);
      }
    } else {
      const created = await createDrop(dropData);
      if (created) {
        setCards([...cards, created.data]);
        setModalOpen(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Card List</h1>
        <Button style={{ backgroundColor: '#4096FF', color: '#fff' }} onClick={openAddModal}>
          Add Card
        </Button>
      </div>

      {cards.length === 0 && <div className="text-gray-500 mb-4">No cards available.</div>}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <CardBox
            key={index}
            card={card}
            index={index}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CardModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={editingIndex !== null}
      />
    </div>
  );
}
