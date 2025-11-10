import React, { useState } from 'react';
import { Card, Button, Modal } from 'antd';
import dayjs from 'dayjs';
import type { CardType } from '../../../pages/Admin-drops';

interface CardBoxProps {
  card: CardType;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const CardBox: React.FC<CardBoxProps> = ({ card, index, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(index);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card
        title={card.title}
        extra={
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              style={{ backgroundColor: '#4096FF' }}
              onClick={() => onEdit(index)}
            >
              Edit
            </Button>
            <Button danger size="small" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        }
      >
        <p>{card.description}</p>
        <p>
          <strong>Start:</strong> {dayjs(card.startAt).format('YYYY-MM-DD HH:mm')}
        </p>
        <p>
          <strong>End:</strong> {dayjs(card.endAt).format('YYYY-MM-DD HH:mm')}
        </p>
      </Card>

      <Modal
        title="Confirm Delete"
        open={confirmOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
        okButtonProps={{ style: { backgroundColor: '#FF4D4F', color: '#fff' } }}
      >
        <p>Are you sure you want to delete this card?</p>
      </Modal>
    </>
  );
};

export default CardBox;
