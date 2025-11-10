import React from 'react';
import { Modal, Input, DatePicker } from 'antd';
import { Dayjs } from 'dayjs';

const { TextArea } = Input;

interface FormDataType {
  title: string;
  description: string;
  startAt: Dayjs | null;
  endAt: Dayjs | null;
}

interface CardModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  isEdit: boolean;
}

const CardModal: React.FC<CardModalProps> = ({
  open,
  onCancel,
  onSubmit,
  formData,
  setFormData,
  isEdit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      title={isEdit ? 'Edit Card' : 'Add Card'}
      open={open}
      onOk={onSubmit}
      onCancel={onCancel}
      okButtonProps={{ style: { backgroundColor: '#4096FF', color: '#fff' } }}
    >
      <div className="flex flex-col gap-4">
        <Input placeholder="Title" name="title" value={formData.title} onChange={handleChange} />
        <TextArea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
        <DatePicker
          showTime
          placeholder="Start At"
          value={formData.startAt}
          onChange={(date) => setFormData((prev) => ({ ...prev, startAt: date }))}
          className="w-full"
        />
        <DatePicker
          showTime
          placeholder="End At"
          value={formData.endAt}
          onChange={(date) => setFormData((prev) => ({ ...prev, endAt: date }))}
          className="w-full"
        />
      </div>
    </Modal>
  );
};

export default CardModal;
