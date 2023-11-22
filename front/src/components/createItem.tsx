import { Button, Form, Input } from "antd";
import { useAddItem } from "../lib/dataHook";

export default function CreateItem() {
    const [form] = Form.useForm();
    const { trigger } = useAddItem();

    const onFinish = async (values: { todo: string }) => {
        await trigger(values.todo);
        form.resetFields();
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name="create-todo"
            onFinish={onFinish}
        >
            <Form.Item
                name="todo"
                label="To-do Item"
                rules={[
                    {
                        required: true,
                        max: 150,
                        min: 3,
                        message: "Please input To-do item with 3 to 150 chars",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: "8px" }}
                >
                    Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                    Reset
                </Button>
            </Form.Item>
        </Form>
    );
}
