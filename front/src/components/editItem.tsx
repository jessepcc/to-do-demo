import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

import { IDuty } from "../lib/types";

export default function EditItem({
    isModalOpen,
    handleCancel,
    handleEdit,
    editItem,
}: {
    isModalOpen: boolean;
    handleCancel: () => void;
    handleEdit: (id: number, value: string) => void;
    editItem?: IDuty;
}) {
    const [form] = Form.useForm();

    async function handleOk() {
        form.validateFields()
            .then(async (values) => {
                form.resetFields();
                handleEdit(editItem?.id || 0, values.todo.trim());
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
            });
    }

    useEffect(() => {
        if (editItem && editItem.name) {
            form.setFieldsValue({ todo: editItem.name });
        }
    }, [editItem, form]);

    if (!editItem) return null;

    return (
        <Modal
            title="Edit To-do Item"
            open={isModalOpen}
            okText="Edit"
            onOk={handleOk}
            onCancel={handleCancel}
            forceRender
        >
            <Form form={form} name="edit-todo" preserve={false}>
                <Form.Item
                    name="todo"
                    label="To-do Item"
                    rules={[
                        {
                            required: true,
                            max: 150,
                            min: 3,
                            message:
                                "Please input To-do item with 3 to 150 chars",
                        },
                    ]}
                    initialValue={editItem.name}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
