import { useState } from "react";
import { Modal, Button, List, Skeleton, Typography } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import EditItem from "./editItem";
import { useGetItemList, useEditItem, useDeleteItem } from "../lib/dataHook";
import { IDuty } from "../lib/types";

export default function ItemList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<IDuty>();

    const { data, isLoading } = useGetItemList();
    const { trigger } = useEditItem();
    const { trigger: deleteTrigger } = useDeleteItem();
    const { confirm } = Modal;
    const { Paragraph } = Typography;

    const showPromiseConfirm = (id: number) => {
        confirm({
            title: "Are you sure to delete?",
            icon: <ExclamationCircleFilled />,
            content:
                "Are you sure it is done? Can't undo after you confirm it.",
            onOk() {
                return deleteTrigger(id);
            },
            onCancel() {},
        });
    };

    async function handleEdit(id: number, value: string) {
        try {
            console.log(id, value);
            await trigger({
                id: id,
                name: value.trim(),
            });
            setIsModalOpen(false);
            setEditItem(undefined);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                dataSource={data || []}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                type="text"
                                onClick={() => {
                                    setEditItem(item);
                                    setIsModalOpen(true);
                                }}
                            >
                                edit
                            </Button>,
                            <Button
                                danger
                                type="link"
                                onClick={() => showPromiseConfirm(item.id)}
                            >
                                delete
                            </Button>,
                        ]}
                    >
                        <Skeleton
                            avatar
                            title={false}
                            loading={isLoading}
                            active
                        >
                            <Paragraph
                                code
                                style={{
                                    marginBottom: "0px",
                                    maxWidth: "50vw",
                                }}
                            >
                                {item.name}
                            </Paragraph>
                        </Skeleton>
                    </List.Item>
                )}
            />
            <EditItem
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                handleEdit={handleEdit}
                editItem={editItem}
            />
        </div>
    );
}
